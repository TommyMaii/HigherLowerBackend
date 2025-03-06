const request = require('supertest');
const app = require('../index');
const { updateHighscore } = require("../db");


jest.mock("../db", () => ({
    updateHighscore: jest.fn().mockResolvedValue({ highscore: 20 }),
    getHighscore: jest.fn().mockResolvedValue([{ highscore: 20, id: 1 }])
}));

describe("Highscore API Tests", () => {

    test("GetGames should return games array",async () => {
        const response = await request(app).get("/getGames");
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("name");
    })

    test("GetHighscore should return a highscore", async () => {
        const response = await request(app).get("/GetHighscore");
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("highscore");
    });

    test("UpdateHighscore should mock highscore update", async () => {
        const newHighscore = { highscore: 20 };

        const response = await request(app)
            .put("/UpdateHighscore")
            .send(newHighscore)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Highscore updated!");
        expect(response.body).toHaveProperty("highscore", 20);

        expect(updateHighscore).toHaveBeenCalledWith("20");
    });
});