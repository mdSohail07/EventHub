const axios = require('axios');
const cheerio = require('cheerio');
const { pool } = require('./db.js');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runAutoScraper() {
    console.log('🤖 [Auto-Scraper] Initiating live opportunities pipeline...');

    try {
        const response = await axios.get('https://devpost.com/hackathons?challenge_type[]=online', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const scrapedItems = [];

        $('.hackathon-tile').slice(0, 3).each((_, el) => {
            const title = $(el).find('h3').text().trim();
            const link = $(el).find('a').attr('href');
            const snippet = $(el).find('.tagline').text().trim() || title;
            const deadline = $(el).find('.submission-period').text().trim();

            if (title && link) {
                scrapedItems.push({
                    title,
                    link: link.startsWith('http') ? link : `https://devpost.com${link}`,
                    rawText: `${title}: ${snippet}. Submission info: ${deadline}`
                });
            }
        });

        for (const item of scrapedItems) {
            const prompt = `Extract event details from the following text. Reply strictly in JSON format with three keys: "title", "ai_summary" (a concise 2-sentence summary), and "deadline" (in YYYY-MM-DD HH:MM:SS format, use 2026). Text: ${item.rawText}`;

            const aiRes = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const cleanText = aiRes.text.replace(/```json\n?|```/g, '').trim();
            const parsed = JSON.parse(cleanText);

            const exists = await pool.query('SELECT id FROM events WHERE title = $1', [parsed.title]);
            if (exists.rows.length === 0) {
                await pool.query(
                    `INSERT INTO events (source_platform, title, ai_summary, deadline, application_link, embedding)
                     VALUES ($1, $2, $3, $4, $5, '[]'::jsonb)`,
                    ['Devpost', parsed.title, parsed.ai_summary, parsed.deadline, item.link]
                );
                console.log(`✅ [Scraper] Live Inserted to DB: ${parsed.title}`);
            }
        }
    } catch (err) {
        console.error('ℹ️ [Scraper Notice]:', err.message);
    }
}

module.exports = { runAutoScraper };