const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    settings: { type: Object, default: {} }, // Store user settings as an object
});

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the meal
});

const User = mongoose.model('User', userSchema);
const Meal = mongoose.model('Meal', mealSchema);

const runMigration = async () => {
    await User.createCollection();
    await Meal.createCollection();
    console.log('Users and Meals collections created');
};

runMigration().catch(console.error); 