const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL on Render"))
    .catch(err => console.error("PostgreSQL connection error:", err));

async function getHighscore() {
    const result = await pool.query("SELECT * FROM highscores");
    return result.rows;
}

async function updateHighscore(newHighscore) {
    const result = await pool.query(
        "UPDATE highscores SET highscore = $1 WHERE id = 1 RETURNING *",
        [newHighscore]
    );
    return result.rows[0];
}

module.exports = { getHighscore, updateHighscore };