import { test, expect } from '@playwright/test';

test.describe('Nutrition Tracker Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the app
    await page.goto('/');
    
    // Wait for the app to be ready
    await page.waitForLoadState('networkidle');
    
    // Mock Supabase auth to simulate logged-in state
    await page.evaluate(() => {
      window.localStorage.setItem('sb-auth-token', JSON.stringify({
        currentSession: {
          access_token: 'test-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }
      }));
    });
    
    // Reload page to apply auth state
    await page.reload();
    
    // Wait for the dashboard to be ready
    await page.waitForSelector('[data-testid="dashboard"]', { state: 'visible', timeout: 5000 });
  });

  test('should allow adding a food item to breakfast', async ({ page }) => {
    // Wait for the breakfast section to be visible
    await page.waitForSelector('[data-testid="breakfast-section"]');
    
    // Click add food button for breakfast
    await page.click('[data-testid="add-food-breakfast"]');
    
    // Wait for the modal to appear
    await page.waitForSelector('[data-testid="add-food-modal"]');
    
    // Fill in food details
    await page.fill('[data-testid="food-name-input"]', 'Oatmeal');
    await page.fill('[data-testid="serving-size-input"]', '100');
    await page.selectOption('[data-testid="serving-unit-select"]', 'g');
    await page.fill('[data-testid="servings-input"]', '1');
    await page.fill('[data-testid="protein-input"]', '13');
    await page.fill('[data-testid="carbs-input"]', '68');
    await page.fill('[data-testid="fat-input"]', '7');
    
    // Submit form
    await page.click('[data-testid="add-food-submit"]');
    
    // Wait for the food item to appear
    await page.waitForSelector('[data-testid="food-item"]');
    
    // Verify food was added
    const foodItem = page.locator('[data-testid="food-item"]');
    await expect(foodItem).toContainText('Oatmeal');
    await expect(foodItem).toContainText('100g');
    await expect(page.locator('[data-testid="food-macros"]')).toContainText('P: 13g • C: 68g • F: 7g');
  });

  test('should calculate daily totals correctly', async ({ page }) => {
    // Wait for the breakfast section to be visible
    await page.waitForSelector('[data-testid="breakfast-section"]');
    
    // Add food item
    await page.click('[data-testid="add-food-breakfast"]');
    await page.waitForSelector('[data-testid="add-food-modal"]');
    await page.fill('[data-testid="food-name-input"]', 'Chicken Breast');
    await page.fill('[data-testid="serving-size-input"]', '100');
    await page.fill('[data-testid="protein-input"]', '31');
    await page.fill('[data-testid="carbs-input"]', '0');
    await page.fill('[data-testid="fat-input"]', '3.6');
    await page.click('[data-testid="add-food-submit"]');
    
    // Wait for nutrition summary to update
    await page.waitForSelector('[data-testid="nutrition-summary"]');
    
    // Verify nutrition summary updates
    await expect(page.locator('[data-testid="total-protein"]')).toContainText('31g');
    await expect(page.locator('[data-testid="total-carbs"]')).toContainText('0g');
    await expect(page.locator('[data-testid="total-fat"]')).toContainText('3.6g');
  });

  test('should allow deleting a food item', async ({ page }) => {
    // Wait for the breakfast section to be visible
    await page.waitForSelector('[data-testid="breakfast-section"]');
    
    // Add food item
    await page.click('[data-testid="add-food-breakfast"]');
    await page.waitForSelector('[data-testid="add-food-modal"]');
    await page.fill('[data-testid="food-name-input"]', 'Test Food');
    await page.fill('[data-testid="serving-size-input"]', '100');
    await page.click('[data-testid="add-food-submit"]');
    
    // Wait for the food item to appear
    await page.waitForSelector('[data-testid="food-item"]');
    
    // Delete food item
    await page.click('[data-testid="delete-food-button"]');
    await page.click('[data-testid="confirm-delete"]');
    
    // Verify food was deleted
    await expect(page.locator('[data-testid="food-item"]')).not.toBeVisible();
  });
}); 