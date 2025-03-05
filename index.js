const express = require('express');
var cors = require('cors');
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL on Render"))
    .catch(err => console.error("PostgreSQL connection error:", err));

const fileGameDataPath = path.join(__dirname, 'gameData.json');

function readGameData() {
    try {
        const data = fs.readFileSync(fileGameDataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return [];
    }
}

// function readHighScoreData() {
//     try {
//         const data = fs.readFileSync(fileHighScorePath, 'utf8');
//         return JSON.parse(data);
//     } catch (error) {
//         console.error('Error reading JSON file:', error);
//         return { highscore: 0 };
//     }
// }
//
// function updateHighscore(newHighscore) {
//     const data = readHighScoreData();
//
//     data[0].highscore = newHighscore
//
//     try {
//         fs.writeFileSync(fileHighScorePath, JSON.stringify(data, null, 2), 'utf8');
//     } catch (error) {
//         console.error('Error writing to JSON file:', error);
//     }
// }

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is up`);
});

app.get('/getGames', (req, res) => {
    try{
        const games = readGameData();
        res.json(games);
    }catch(err){
        res.status(500).send('Error');
    }
});

// app.get('/getHighscore', (req, res) => {
//     try {
//         const highScore = readHighScoreData();
//         res.json(highScore);
//     }catch(err){
//         res.status(500).send('Error');
//     }
// });

// app.put("/UpdateHighscore", async (req, res) => {
//     try {
//         updateHighscore(req.body.highscore)
//         res.json("New Highscore is: " + req.body.highscore);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// })

app.get("/GetHighScore", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM highscores');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.put("/UpdateHighscore", async (req, res) => {
    try {
        let data = JSON.stringify(req.body.highscore)
        const result = await pool.query(
            `UPDATE highscores SET highscore = ${data} WHERE id = 1`
        );
        console.log("Updated highscore");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})
