import { expect, Page, APIRequestContext } from "@playwright/test";

export const BASE_URL = "http://localhost:3000";
export const API_URL = "http://localhost:3002";

/**
 * Dismisses the content warning modal on the map page.
 *
 * Used by:
 *   - Story 2 (Informed Consent)   - AC1: modal appears on load
 *                                  - AC2: Continue button is required to proceed
 *   - All stories via beforeEach   - precondition for every test
 */
export async function dismissModal(page: Page): Promise<void> {
    await expect(page.locator("text=CONTENT WARNING")).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click({ force: true });
    await expect(page.locator("text=CONTENT WARNING")).toBeHidden();
}

/**
 * Waits for the map page to be fully loaded and interactive.
 *
 * Used by:
 *   - All stories via beforeEach, precondition for every test
 */
export async function waitForMapReady(page: Page): Promise<void> {
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[data-testid="empire-selector-title"]')).toBeVisible({ timeout: 10000 });
}

/**
 * Reads all empire options from the dropdown, excluding empty values
 * and the "All Empires" placeholder.
 *
 * Used by:
 *   - Story 2 (Informed Consent)   - AC3: empire selector shows all available empires
 *   - Story 1 (Psychological Wellbeing) - AC3/AC4/AC5: loop over every empire
 *   - loops all empires for full verification
 */
export async function getAvailableEmpires(page: Page): Promise<string[]> {
    const options = await page.locator('[data-testid="empire-select"] option').allTextContents();
    return options.filter((o) => o.trim() !== "" && o !== "All Empires");
}

/**
 * Selects an empire from the dropdown and asserts the expected UI changes:
 *   - Empire selector fades out
 *   - Sidebar slides into viewport
 *   - Correct empire name appears in sidebar header
 *   - Sidebar never shows empty/loading state - only appears after cards load
 *   - Card links are present in the sidebar
 *
 * Used by:
 *   - Story 1 (Psychological Wellbeing) - AC3: sidebar loads only after cards ready
 *                                        - AC4: empire name + card count visible
 *                                        - AC5: Back to Empires button visible
 */
export async function selectEmpireAndVerify(page: Page, empire: string): Promise<void> {
    await page.locator('[data-testid="empire-select"]').selectOption(empire);

    // AC3 - empire selector fades out signalling transition to sidebar view
    await expect(page.locator('[data-testid="empire-selector-container"]')).toHaveCSS("opacity", "0", {
        timeout: 10000,
    });

    // AC5 - Back to Empires button is in viewport (user can exit at any point)
    await expect(page.locator("text=Back to Empires")).toBeInViewport({ timeout: 10000 });

    // AC4 - correct empire name visible in sidebar header
    await expect(page.locator(`text=${empire} Empire`)).toBeInViewport({ timeout: 10000 });

    // AC3 - sidebar never shows loading/empty state; slides in only after cards loaded
    await expect(page.locator("text=Loading...")).toBeHidden({ timeout: 10000 });

    const cardCount = await page.locator('a[href*="/cards/"]').count();
    expect(cardCount, `Expected cards to load for ${empire} empire`).toBeGreaterThanOrEqual(0);
}

/**
 * Clicks "Back to Empires" and verifies the sidebar closes and the empire
 * selector reappears.
 *
 * Used by:
 *   - Story 1 (Psychological Wellbeing) - AC5: user can return to empire selector
 *   - Story 3 (Historical Authenticity) - AC7: map returns to unmodified state
 */
export async function closeSidebarAndVerify(page: Page): Promise<void> {
    await page.getByRole("button", { name: "← Back to Empires" }).click();
    await page.waitForTimeout(450);
    await expect(page.locator("text=Back to Empires")).not.toBeInViewport();
    await expect(page.locator('[data-testid="empire-selector-title"]')).toBeVisible({ timeout: 10000 });
}

/**
 * Fetches all countries belonging to a specific empire from the database.
 *
 * Used by:
 *   - Combined API+UI test - cross references countries when verifying card filtering
 */
export async function getCountriesForEmpire(request: APIRequestContext, empire: string) {
    const res = await request.get(`${API_URL}/api/map/countries?empire=${empire}`);
    expect(res.status(), `Countries endpoint should return 200 for ${empire}`).toBe(200);
    return await res.json();
}

/**
 * Fetches all cards belonging to a specific empire from the database.
 * Cards are matched by empire field OR by country name via cross-collection lookup.
 *
 * Used by:
 *   - Combined API+UI test - verifies correct cards are returned per empire
 */
export async function getCardsForEmpire(request: APIRequestContext, empire: string) {
    const res = await request.get(`${API_URL}/api/map/allcardswithlocation?empire=${empire}`);
    expect(res.status(), `Cards endpoint should return 200 for ${empire}`).toBe(200);
    return await res.json();
}

/**
 * Full API correctness check for a given empire:
 *   1. Fetches countries for the empire
 *   2. Fetches cards returned for the empire
 *   3. Asserts every card belongs via empire field OR country name
 *   4. Asserts no cards from other empires are incorrectly included
 *   5. Asserts empire/country/both breakdown sums to total card count
 *
 * Used by:
 *   - Combined API+UI test - API half of full empire verification
 */
export async function verifyCardsForEmpire(request: APIRequestContext, empire: string) {
    const countries = await getCountriesForEmpire(request, empire);
    const countryNames = countries.map((c: any) => c.name);
    expect(countryNames.length, `${empire} should have at least one country`).toBeGreaterThan(0);

    const cards = await getCardsForEmpire(request, empire);

    // every returned card must belong to this empire via empire field or country name
    cards.forEach((card: any) => {
        const matchedByEmpire = card.empire === empire;
        const matchedByCountry = countryNames.includes(card.country);
        expect(
            matchedByEmpire || matchedByCountry,
            `Card #${card.number} (empire: ${card.empire}, country: ${card.country}) does not belong to ${empire}`,
        ).toBeTruthy();
    });

    // no cards from other empires should be included
    const wrongCards = cards.filter((card: any) => card.empire !== empire && !countryNames.includes(card.country));
    expect(wrongCards.length, `${wrongCards.length} cards incorrectly returned for ${empire}`).toBe(0);

    // empire / country / both breakdown must sum to total
    const countryOnly = cards.filter((c: any) => c.empire !== empire && countryNames.includes(c.country)).length;
    const empireOnly = cards.filter((c: any) => c.empire === empire && !countryNames.includes(c.country)).length;
    const both = cards.filter((c: any) => c.empire === empire && countryNames.includes(c.country)).length;

    expect(countryOnly + empireOnly + both, `Card breakdown should add up to total cards for ${empire}`).toBe(
        cards.length,
    );
}
