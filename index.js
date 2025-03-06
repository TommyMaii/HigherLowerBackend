const express = require('express');
var cors = require('cors');
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const db = require("./db");
const app = express();

app.use(express.json());
app.use(cors());

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

app.get('/getGames', (req, res) => {
    try{
        const games = readGameData();
        res.json(games);
    }catch(err){
        res.status(500).send('Error');
    }
});

app.get("/GetHighScore", async (req, res) => {
    try {
        const result = await db.getHighscore();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.put("/UpdateHighscore", async (req, res) => {
    try {
        let highscore = JSON.stringify(req.body.highscore)

        const updatedHighScore = await db.updateHighscore(highscore);

        res.json({ message: "Highscore updated!", highscore: updatedHighScore.highscore });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = app;