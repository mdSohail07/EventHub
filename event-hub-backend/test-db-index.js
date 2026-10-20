const { pool } = require('./db.js');

async function runIndexTest() {
    const client = await pool.connect();
    
    try {
        console.log("🚀 Starting PostgreSQL Index Performance Test...");
        
        // 1. Begin a transaction so we can rollback everything at the end (won't ruin your database)
        await client.query('BEGIN');
        
        console.log("⏳ Inserting 100,000 dummy events to simulate a massive database (this might take a few seconds)...");
        
        // Insert a dummy user
        const userRes = await client.query(`INSERT INTO users (email, password_hash) VALUES ('testuser@example.com', 'hashed') RETURNING id`);
        const userId = userRes.rows[0].id;

        // Generate 100,000 dummy events efficiently
        await client.query(`
            INSERT INTO events (title, ai_summary, deadline, application_link, source_platform, embedding)
            SELECT 
                'Dummy Hackathon ' || i, 
                'Summary ' || i, 
                NOW() + (random() * (INTERVAL '30 days')) - INTERVAL '10 days', 
                '#', 
                'Community',
                '[]'::jsonb
            FROM generate_series(1, 100000) AS s(i);
        `);

        // Save 50,000 of them for our test user
        await client.query(`
            INSERT INTO saved_events (user_id, event_id, status)
            SELECT $1, id, 'Applying' FROM events ORDER BY random() LIMIT 50000;
        `, [userId]);

        const testQuery = `
            EXPLAIN ANALYZE 
            SELECT events.title, events.deadline 
            FROM saved_events
            JOIN events ON events.id = saved_events.event_id
            WHERE events.deadline >= NOW() 
              AND events.deadline <= NOW() + INTERVAL '2 days'
              AND saved_events.status = 'Applying'
              AND saved_events.user_id = $1;
        `;

        console.log("\n📊 Running complex query WITHOUT an index...");
        const resWithoutIndex = await client.query(testQuery, [userId]);
        
        // Extract execution time from EXPLAIN ANALYZE output
        const withoutIndexOutput = resWithoutIndex.rows.map(r => Object.values(r)[0]).join('\n');
        const withoutIndexTimeMatch = withoutIndexOutput.match(/Execution Time: ([\d.]+) ms/);
        const timeWithoutIndex = parseFloat(withoutIndexTimeMatch[1]);
        
        console.log(`⏱️ Time without index: ${timeWithoutIndex.toFixed(2)} ms`);

        console.log("\n⚡ Creating Indexes on 'deadline' and 'status'...");
        await client.query(`CREATE INDEX idx_events_deadline ON events(deadline)`);
        await client.query(`CREATE INDEX idx_saved_events_status ON saved_events(status, user_id)`);

        console.log("📊 Running the exact same query WITH the indexes...");
        const resWithIndex = await client.query(testQuery, [userId]);
        
        const withIndexOutput = resWithIndex.rows.map(r => Object.values(r)[0]).join('\n');
        const withIndexTimeMatch = withIndexOutput.match(/Execution Time: ([\d.]+) ms/);
        const timeWithIndex = parseFloat(withIndexTimeMatch[1]);

        console.log(`⏱️ Time with index: ${timeWithIndex.toFixed(2)} ms`);

        // Calculate improvement
        const percentageFaster = (((timeWithoutIndex - timeWithIndex) / timeWithoutIndex) * 100).toFixed(2);
        const speedupMultiplier = (timeWithoutIndex / timeWithIndex).toFixed(1);

        console.log("\n==================================================");
        console.log("🏆 FINAL METRIC FOR RESUME:");
        console.log(`"Optimized complex PostgreSQL queries by implementing B-Tree indexes, reducing query execution time from ${timeWithoutIndex.toFixed(2)}ms to ${timeWithIndex.toFixed(2)}ms (an improvement of ${percentageFaster}% / ${speedupMultiplier}x faster)."`);
        console.log("==================================================\n");

        console.log("🧹 Cleaning up... Removing the 100,000 dummy records and indexes so your database stays perfectly clean.");
        // Rollback undoes all inserts and index creations in this transaction
        await client.query('ROLLBACK');
        console.log("✅ Cleanup complete!");

    } catch (err) {
        console.error("❌ Error during test:", err);
        await client.query('ROLLBACK');
    } finally {
        client.release();
        process.exit(0); // Exit script
    }
}

runIndexTest();
