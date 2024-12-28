const Meal = require('../models/Meal'); // Assuming a Meal model is defined

exports.getMeals = async (req, res) => {
    try {
        const meals = await Meal.find();
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving meals' });
    }
};

exports.createMeal = async (req, res) => {
    const newMeal = new Meal(req.body);
    try {
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (error) {
        res.status(500).json({ error: 'Error creating meal' });
    }
};

exports.updateMeal = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedMeal = await Meal.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedMeal);
    } catch (error) {
        res.status(500).json({ error: 'Error updating meal' });
    }
};

exports.deleteMeal = async (req, res) => {
    const { id } = req.params;
    try {
        await Meal.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting meal' });
    }
}; 