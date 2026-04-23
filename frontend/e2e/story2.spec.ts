import { test, expect } from "@playwright/test";
import { BASE_URL, dismissModal, waitForMapReady, getAvailableEmpires } from "./helper";

// USER STORY 2 - Informed Consent
//
// Values: Safety, Autonomy, Trust

test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/map`);
});

/**
 * Story 2 - AC1: Content warning modal appears immediately on page load,
 *                before any map content is visible.
 * Story 2 - AC2: The user must click "Continue" to proceed - there is no way
 *                to bypass the warning.
 */
test("AC1/AC2 - content warning modal appears and requires explicit dismissal", async ({ page }) => {
    // AC1 - modal is visible immediately on load before any interaction
    await expect(page.locator("text=CONTENT WARNING")).toBeVisible();

    // AC2 - Continue button is the only way to proceed; dismissing proves it works
    await dismissModal(page);

    // AC2 - after dismissal the modal is gone and the map is accessible
    await waitForMapReady(page);
});

/**
 * Story 2 - AC3: After dismissing the modal the empire selector is visible
 *                and shows all available empires, giving the user a clear
 *                starting point for deliberate exploration.
 *
 */
test("AC3 - empire selector visible with all empires after modal dismissed", async ({ page }) => {
    await dismissModal(page);
    await waitForMapReady(page);

    // AC3 - dropdown contains one or more selectable empire options
    const empires = await getAvailableEmpires(page);
    expect(empires.length, "Dropdown should contain at least one empire after modal dismissed").toBeGreaterThan(0);
});

/**
 * Story 2 - AC4: Empire name and card count visible in sidebar header
 *                after a selection is made.
 */
test("AC4 - empire name and card count visible in sidebar after selection", async ({ page }) => {
    await dismissModal(page);
    await waitForMapReady(page);

    await page.locator('[data-testid="empire-select"]').selectOption("British");

    // AC4 - empire name visible in sidebar header
    await expect(page.locator("text=British Empire")).toBeInViewport({ timeout: 10000 });

    // AC4 - card count is visible (any number including 0)
    await expect(page.locator('[data-testid="card-count"]')).toBeVisible({ timeout: 10000 });
});

/**
 * Story 2 - AC5: Back to Empires button is always visible in sidebar,
 *                user can exit at any point without viewing full images.
 */
test("AC5 - Back to Empires button visible and returns user to empire selector", async ({ page }) => {
    await dismissModal(page);
    await waitForMapReady(page);

    await page.locator('[data-testid="empire-select"]').selectOption("British");

    // AC5 - Back to Empires button is visible immediately when sidebar opens
    await expect(page.locator("text=Back to Empires")).toBeInViewport({ timeout: 10000 });

    // AC5 - clicking it returns user to empire selector without viewing any card
    await page.getByRole("button", { name: "← Back to Empires" }).click();
    await page.waitForTimeout(450);
    await expect(page.locator('[data-testid="empire-selector-title"]')).toBeVisible({ timeout: 10000 });
});

/**
 * Story 2 - AC6: Clicking a card navigates to the full card detail page
 *                with additional description.
 */
test("AC6 - clicking a card navigates to card detail page", async ({ page }) => {
    await dismissModal(page);
    await waitForMapReady(page);

    await page.locator('[data-testid="empire-select"]').selectOption("British");

    // wait for sidebar cards to load
    await expect(page.locator("text=Back to Empires")).toBeInViewport({ timeout: 10000 });
    await expect(page.locator("text=Loading...")).toBeHidden({ timeout: 10000 });

    // AC6 - click the first card link
    const firstCard = page.locator('a[href*="/cards/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();

    // AC6 - navigated to card detail page
    await expect(page).toHaveURL(/\/cards\//, { timeout: 10000 });

    // AC6 - card detail page has a description visible
    await expect(page.locator('[data-testid="card-description"]')).toBeVisible({ timeout: 10000 });
});
