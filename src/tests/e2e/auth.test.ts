import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to be ready
    await page.waitForSelector('#root', { state: 'visible' });
  });

  test('shows login state correctly', async ({ page }) => {
    // Wait for initial loading to complete
    await page.waitForSelector('[data-testid="login-button"]', { state: 'visible', timeout: 10000 });
    
    // Mock signed-in state
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
    
    // Reload to apply auth state
    await page.reload();
    await page.waitForSelector('#root', { state: 'visible' });
    
    // Should now show user email
    await page.waitForSelector('[data-testid="user-email"]', { state: 'visible', timeout: 10000 });
    await expect(page.locator('[data-testid="user-email"]')).toContainText('test@example.com');
  });

  test('handles sign out correctly', async ({ page }) => {
    // Start in signed-in state
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
    await page.reload();
    await page.waitForSelector('#root', { state: 'visible' });
    
    // Wait for user email to be visible before clicking sign out
    await page.waitForSelector('[data-testid="user-email"]', { state: 'visible', timeout: 10000 });
    
    // Click sign out
    await page.click('[data-testid="logout-button"]');
    
    // Should show login button again
    await page.waitForSelector('[data-testid="login-button"]', { state: 'visible', timeout: 10000 });
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    
    // Local storage should be cleared
    const authToken = await page.evaluate(() => window.localStorage.getItem('sb-auth-token'));
    expect(authToken).toBeNull();
  });
}); 