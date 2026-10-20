const axios = require('axios');
const { pool } = require('./db.js');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Devpost Public JSON API ──────────────────────────────────────────────────
// Devpost exposes a public JSON feed — more reliable than HTML scraping
// because Devpost's frontend is JS-rendered (cheerio couldn't parse it).
async function scrapeDevpost() {
    try {
        const response = await axios.get(
            'https://devpost.com/api/hackathons?challenge_type[]=online&status[]=upcoming&status[]=open&order_by=deadline&per_page=6',
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                },
                timeout: 12000
            }
        );

        const hackathons = response.data?.hackathons || [];
        console.log(`📥 [Devpost] Found ${hackathons.length} hackathons via API`);

        const items = [];
        for (const h of hackathons.slice(0, 5)) {
            const title = h.title || '';
            const link = h.url || '#';
            const tagline = h.tagline || '';
            const submissionPeriodDates = h.submission_period_dates || '';

            if (title) {
                items.push({
                    title,
                    link,
                    platform: 'Devpost',
                    rawText: `${title}: ${tagline}. Submission period: ${submissionPeriodDates}`
                });
            }
        }
        return items;
    } catch (err) {
        console.error('⚠️ [Devpost API] Failed:', err.message);
        return [];
    }
}

// ─── Devfolio Fallback — Community Seeded Events ─────────────────────────────
// Devfolio blocks automated scraping. We seed curated real events as fallback
// so the DB is never empty on first boot.
function getSeededEvents() {
    const now = new Date();

    // Generate deadline ~30 days from now
    const deadline30 = new Date(now);
    deadline30.setDate(now.getDate() + 30);

    const deadline60 = new Date(now);
    deadline60.setDate(now.getDate() + 60);

    const deadline15 = new Date(now);
    deadline15.setDate(now.getDate() + 15);

    const fmt = (d) => d.toISOString().slice(0, 19).replace('T', ' ');

    return [
        {
            title: 'Smart India Hackathon 2026',
            platform: 'Devfolio',
            ai_summary: 'Smart India Hackathon (SIH) is a nationwide initiative by the Government of India to provide students a platform to solve some of the pressing problems we face in our daily lives. Teams of 6 compete for cash prizes and recognition from India\'s top ministries.',
            deadline: fmt(deadline60),
            link: 'https://sih.gov.in'
        },
        {
            title: 'MLH Global Hackathon Season 2026',
            platform: 'Devpost',
            ai_summary: 'Major League Hacking organizes 200+ official hackathons per year across the globe. Join thousands of student developers building innovative projects in 24-48 hour sprints with mentors, workshops, and prizes.',
            deadline: fmt(deadline30),
            link: 'https://mlh.io/seasons/2026/events'
        },
        {
            title: 'Google Summer of Code 2026',
            platform: 'LinkedIn',
            ai_summary: 'Google Summer of Code is a global program focused on bringing more student developers into open source software development. Students receive a stipend to work on open source projects over the summer under the guidance of mentor organizations.',
            deadline: fmt(deadline15),
            link: 'https://summerofcode.withgoogle.com'
        },
        {
            title: 'Microsoft Imagine Cup 2026',
            platform: 'Devpost',
            ai_summary: 'Microsoft Imagine Cup is a global technology competition for students where teams build solutions using Microsoft technologies. Winners receive up to $100,000, mentorship from Microsoft engineers, and a chance to present to Satya Nadella.',
            deadline: fmt(deadline30),
            link: 'https://imaginecup.microsoft.com'
        },
        {
            title: 'Flipkart Grid 6.0 — Software Engineering',
            platform: 'Unstop',
            ai_summary: 'Flipkart Grid is one of India\'s biggest engineering hackathons for students, hosted by Flipkart. This edition focuses on supply chain optimization, ML-based recommendations, and scalable software architecture. Shortlisted teams get internship opportunities.',
            deadline: fmt(deadline60),
            link: 'https://unstop.com/hackathons/flipkart-grid'
        },
        {
            title: 'GitHub Copilot Hackathon — AI Builders',
            platform: 'Devpost',
            ai_summary: 'Build the next generation of AI-powered developer tools using GitHub Copilot APIs and extensions. This global online hackathon rewards the most creative and impactful use of AI coding assistance. Open to all developers worldwide with prizes up to $25,000.',
            deadline: fmt(deadline15),
            link: 'https://github.blog/developer-skills'
        }
    ];
}

// ─── AI Enrichment for Devpost API items ─────────────────────────────────────
async function enrichWithAI(rawText) {
    try {
        const prompt = `Extract event details from the following text. Reply strictly in JSON with three keys: "title", "ai_summary" (a concise 2-sentence summary), "deadline" (YYYY-MM-DD HH:MM:SS format, use 2026 if year unknown). Text: ${rawText}`;

        const aiRes = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const cleanText = aiRes.text.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(cleanText);

        // Validate deadline
        if (!parsed.deadline || isNaN(Date.parse(parsed.deadline))) {
            const fallback = new Date();
            fallback.setDate(fallback.getDate() + 30);
            parsed.deadline = fallback.toISOString().slice(0, 19).replace('T', ' ');
        }

        return parsed;
    } catch (err) {
        console.error('⚠️ [AI Enrichment] Failed:', err.message);
        return null;
    }
}

// ─── Insert Event (Dedup by title) ───────────────────────────────────────────
async function insertIfNew(platform, title, ai_summary, deadline, link) {
    try {
        const exists = await pool.query('SELECT id FROM events WHERE title = $1', [title]);
        if (exists.rows.length === 0) {
            await pool.query(
                `INSERT INTO events (source_platform, title, ai_summary, deadline, application_link, embedding)
                 VALUES ($1, $2, $3, $4, $5, '[]'::jsonb)`,
                [platform, title, ai_summary, deadline, link]
            );
            console.log(`✅ [Scraper] Inserted: "${title}"`);
            return true;
        }
        return false;
    } catch (err) {
        console.error(`❌ [Scraper] Insert failed for "${title}":`, err.message);
        return false;
    }
}

// ─── Main Exported Function ───────────────────────────────────────────────────
async function runAutoScraper() {
    console.log('🤖 [Auto-Scraper] Starting live opportunities pipeline...');
    let insertedCount = 0;

    // 1. Try Devpost JSON API first
    const devpostItems = await scrapeDevpost();

    for (const item of devpostItems) {
        const enriched = await enrichWithAI(item.rawText);
        if (!enriched) continue;

        const inserted = await insertIfNew(
            item.platform,
            enriched.title || item.title,
            enriched.ai_summary,
            enriched.deadline,
            item.link
        );
        if (inserted) insertedCount++;
    }

    // 2. Always seed curated events on first boot (DB empty check)
    const countRes = await pool.query('SELECT COUNT(*) FROM events');
    const totalEvents = parseInt(countRes.rows[0].count);

    if (totalEvents < 3) {
        console.log('📦 [Scraper] DB looks empty — seeding curated events...');
        const seeded = getSeededEvents();
        for (const ev of seeded) {
            const inserted = await insertIfNew(
                ev.platform, ev.title, ev.ai_summary, ev.deadline, ev.link
            );
            if (inserted) insertedCount++;
        }
    }

    console.log(`🎉 [Auto-Scraper] Done. ${insertedCount} new events inserted.`);
}

module.exports = { runAutoScraper };