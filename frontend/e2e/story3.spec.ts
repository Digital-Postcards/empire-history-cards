import { test, expect } from "@playwright/test";
import {
    BASE_URL,
    dismissModal,
    waitForMapReady,
    getAvailableEmpires,
    selectEmpireAndVerify,
    closeSidebarAndVerify,
    getCardsForEmpire,
    verifyCardsForEmpire,
} from "./helper";

// USER STORY 3 - Historical Authenticity
//
//
// Values: Historical Integrity, Scholarly Accuracy, Trust

test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/map`);
    // Story 2 AC1 + AC2 are implicitly exercised here on every run -
    // modal must appear and be dismissed before any Story 3 test can proceed
    await dismissModal(page);
    await waitForMapReady(page);
});

/**
 * Story 3 - AC1: The base map renders the authentic 1910 historical image,
 *                not a modern tile layer or placeholder.
 */
test("AC1 - base map renders the authentic 1910 historical image", async ({ page }) => {
    await page.waitForSelector(".leaflet-image-layer", { timeout: 10000 });

    // AC1 - ImageOverlay is loaded, has natural width, and references the correct file
    const imageLoaded = await page.evaluate(() => {
        const img = document.querySelector(".leaflet-image-layer") as HTMLImageElement;
        return img && img.naturalWidth > 0 && img.src.includes("World_1910");
    });

    expect(imageLoaded, "1910 historical map image should be loaded and correct").toBeTruthy();
});

/**
 * Story 3 - AC2: No pins, markers, dots or clusters are visible on the map
 *                at rest (before any empire is selected).
 * Story 3 - AC3: No numbers or labels are added to territories at rest.
 * Story 3 - AC4: No modern UI elements are overlaid on the map surface at rest.
 * Story 3 - AC5: The map appears exactly as the original image when the user
 *                is not interacting with it.
 */
test("AC2/AC3/AC4/AC5 - map is unmodified at rest before empire selection", async ({ page }) => {
    // AC2 + AC4 - no Leaflet marker icons on the map
    const markerCount = await page.locator(".leaflet-marker-icon").count();
    expect(markerCount, "No pins should be visible on map at rest").toBe(0);

    // AC3 + AC4 - no Leaflet tooltips (labels or numbers) on the map
    const tooltipCount = await page.locator(".leaflet-tooltip").count();
    expect(tooltipCount, "No tooltips should be visible on map at rest").toBe(0);
});

/**
 * Story 3 - AC6: Country pins appear on the map only when an empire is
 *                deliberately selected by the user.
 * Story 3 - AC7: Pins disappear and the map returns to its unmodified state
 *                when the user clicks "Back to Empires".
 */
test("AC6/AC7 - pins appear on empire selection and disappear on close", async ({ page }) => {
    // AC6 precondition - no pins before any selection
    const before = await page.locator(".leaflet-marker-icon").count();
    expect(before, "No pins before empire selected").toBe(0);

    await page.locator('[data-testid="empire-select"]').selectOption("British");
    await page.waitForTimeout(500);

    // AC6 - pins appear after a deliberate empire selection
    const after = await page.locator(".leaflet-marker-icon").count();
    expect(after, "Pins should appear after empire selected").toBeGreaterThan(0);

    // AC7 - pins disappear and map is restored when user navigates back
    await page.getByRole("button", { name: "← Back to Empires" }).click();
    await page.waitForTimeout(450);

    const restored = await page.locator(".leaflet-marker-icon").count();
    expect(restored, "Pins should disappear when Back to Empires clicked").toBe(0);
});

/**
 * Cards returned for each empire match via empire field OR
 *                 country name; no cards from other empires are included;
 *                 empire/country/both breakdown sums to total.
 * Sidebar opens with correct empire name, never shows empty
 *                 state, and closes cleanly for every empire.
 *
 * Addresses:
 *   Story 3 AC6   - pins (and cards) appear only for the selected empire
 *   Story 1 AC3/4 - sidebar loads correctly with real data for every empire
 */
test("all empires - API card filtering and UI rendering are correct", async ({ page, request }) => {
    const empires = await getAvailableEmpires(page);

    for (const empire of empires) {
        // verify correct cards returned for this empire
        await verifyCardsForEmpire(request, empire);

        // verify sidebar opens and closes correctly for this empire
        await selectEmpireAndVerify(page, empire);
        await closeSidebarAndVerify(page);
    }
});
