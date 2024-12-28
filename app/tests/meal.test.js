const request = require('supertest');
const app = require('../app'); // Assuming the Express app is exported from app.js
const Meal = require('../models/Meal'); // Assuming a Meal model is defined

describe('Meals Management', () => {
    let mealId;

    it('should create a new meal', async () => {
        const response = await request(app)
            .post('/api/meals')
            .send({ name: 'Pasta', calories: 300 });
        expect(response.status).toBe(201);
        mealId = response.body._id; // Store the meal ID for later tests
    });

    it('should retrieve all meals', async () => {
        const response = await request(app).get('/api/meals');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should update an existing meal', async () => {
        const response = await request(app)
            .put(`/api/meals/${mealId}`)
            .send({ name: 'Pasta with Sauce', calories: 400 });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Pasta with Sauce');
    });

    it('should delete a meal', async () => {
        const response = await request(app).delete(`/api/meals/${mealId}`);
        expect(response.status).toBe(204);
    });
}); 