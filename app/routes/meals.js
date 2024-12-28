const express = require('express');
const { getMeals, createMeal, updateMeal, deleteMeal } = require('../controllers/mealController');

const router = express.Router();

router.get('/', getMeals);
router.post('/', createMeal);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);

module.exports = router; 