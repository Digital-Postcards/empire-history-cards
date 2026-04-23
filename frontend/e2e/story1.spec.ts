import { test, expect } from "@playwright/test";
import {
    BASE_URL,
    dismissModal,
    waitForMapReady,
    getAvailableEmpires,
    selectEmpireAndVerify,
    closeSidebarAndVerify,
} from "./helper";

// USER STORY 1 - Psychological Wellbeing
//
// Values: Safety, Autonomy
// modal must appear and be dismissed before any Story 1 test can proceed
test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/map`);
    await dismissModal(page);
    await waitForMapReady(page);
});

/**
 * Story 1 - AC2: No cards or card images load until a deliberate empire
 *                selection is made by the user.
 * Story 1 - AC5: Zero postcard images load before an empire is selected.
 *
 */
test("AC2/AC5 - no cards or images load before empire is selected", async ({ page }) => {
    // AC2 - no card links in DOM before any selection
    const cardCount = await page.locator('a[href*="/cards/"]').count();
    expect(cardCount, "No cards should be visible before empire selection").toBe(0);

    // AC5 - no postcard images loaded before any selection
    const imageCount = await page.locator('img[src*="/public"]').count();
    expect(imageCount, "No postcard images should load before empire selection").toBe(0);
});

/**
 * Story 1 - AC3: Sidebar slides in only after cards have finished loading;
 *                never shows an empty or loading state.
 * Story 1 - AC4: Empire name and card count are visible in the sidebar
 *                header after a selection is made.
 * Story 1 - AC5: "Back to Empires" button is always visible so the user
 *                can exit at any point without being trapped.
 */
test("AC3/AC4/AC5 - sidebar loads correctly for all empires", async ({ page }) => {
    const empires = await getAvailableEmpires(page);

    for (const empire of empires) {
        // AC3 + AC4 + AC5 verified inside selectEmpireAndVerify
        await selectEmpireAndVerify(page, empire);

        // AC5 - user can always return to the empire selector
        await closeSidebarAndVerify(page);
    }
});
