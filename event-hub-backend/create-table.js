// create-table.js
const { pool } = require('./db.js');

async function initializeDatabase() {
    try {
        // 1. Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                preferences JSONB DEFAULT '[]'::jsonb,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ 'users' table successfully created or verified!");

        // 2. Events Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                source_platform VARCHAR(100),
                title VARCHAR(255) NOT NULL,
                ai_summary TEXT,
                deadline TIMESTAMP,
                application_link TEXT,
                embedding JSONB DEFAULT '[]'::jsonb,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Index for Full-Text Search and filtering
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_events_search 
            ON events USING GIN (to_tsvector('english', title || ' ' || COALESCE(ai_summary, '')));
        `);
        console.log("✅ 'events' table and search index successfully created or verified!");

        // 3. Saved Events Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS saved_events (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                event_id INT REFERENCES events(id) ON DELETE CASCADE,
                status VARCHAR(50) DEFAULT 'Applying',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, event_id)
            );
        `);
        console.log("✅ 'saved_events' table successfully created or verified!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error initializing database schema:", error.message);
        process.exit(1);
    }
}

initializeDatabase();