function handleSubmit(event) {
    event.preventDefault();
    
    // Verify data before submission
    if (!mealType) {
        console.error("Meal type is required.");
        alert("Please select a meal type.");
        return; // Prevent submission if mealType is not valid
    }

    // Enhanced error handling
    supabase
        .from('foods')
        .insert({ /* data */ })
        .then(({ data, error }) => {
            if (error) {
                console.error("Error inserting data:", error);
                alert("Failed to save food item. Please try again.");
                return; // Exit if there's an error
            }
            // Notify parent component of the new food item
            onFoodAdded();
            // Close the modal
            onClose();
        });
} 