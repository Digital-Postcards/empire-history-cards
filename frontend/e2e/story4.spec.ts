import { test, expect, request as apiRequest } from "@playwright/test";

const ADMIN_EMAIL = "hooli.s@northeastern.edu";
const ADMIN_PASSWORD = "hello1234";
const BASE_URL = "http://localhost:3000";
const API_URL = "http://localhost:3002";

/**
 * Logs in as an admin user by navigating to the login page,
 * filling in credentials and waiting for redirect to dashboard
 */

async function loginAsAdmin(page: any) {
  await page.goto(`${BASE_URL}/admin/login`);

  await page.locator('input[type="text"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(`${BASE_URL}/admin/dashboard`, { timeout: 10000 });
  console.log("Logged in as admin");
}

/**
 * Verifies that an authenticated admin can access the map editor page
 *
 * Expected: "Map Pin Editor" panel is visible after navigating to /admin/map
 */
test.describe("Admin Map : Drag and Drop Pin Editor", () => {
  test("admin map page is accessible after login", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/map`);
    await expect(page.locator("text=Map Pin Editor")).toBeVisible({
      timeout: 10000,
    });
    console.log(" Admin map page loaded");
  });

  /**
   * Verifies that selecting an empire from the filter dropdown
   * renders the correct country pins on the map.
   *
   * Expected:
   * No pins visible before an empire is selected
   * Pins appear after selecting "British" from the dropdown
   */

  test("empire filter dropdown works and shows pins", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/map`);
    await page.waitForSelector(".leaflet-container", { timeout: 10000 });
    const pinsBefore = await page.locator(".leaflet-marker-icon").count();
    expect(pinsBefore).toBe(0);
    console.log("No pins visible before empire selected");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "British" }).click();
    await page.waitForTimeout(500);
    const pinsAfter = await page.locator(".leaflet-marker-icon").count();
    expect(pinsAfter).toBeGreaterThan(0);
    console.log(`${pinsAfter} pins visible after selecting British`);
  });

  /**
   * Verifies that dragging a pin persists the updated coordinates
   * to the database via the PATCH /api/map/countries/:id endpoint.
   *
   * This test simulates the drag and drop action by directly calling
   * the PATCH endpoint since Leaflet drag events cannot be reliably
   * triggered through Playwright's mouse simulation.
   *
   * Expected:
   * PATCH request returns 200
   * Updated coordinates are stored in the database
   * Original coordinates are restored after the test
   */

  test("dragging a pin updates coordinates in database", async ({
    request,
  }) => {
    const countriesRes = await request.get(
      `${API_URL}/api/map/countries?empire=British`,
    );
    const countries = await countriesRes.json();
    const targetCountry = countries[0];
    const originalCoordinates = [...targetCountry.coordinates];
    console.log(
      `Original coordinates for ${targetCountry.name}: [${originalCoordinates}]`,
    );
    const newCoordinates = [
      originalCoordinates[0] + 50,
      originalCoordinates[1] + 50,
    ];

    const patchRes = await request.patch(
      `${API_URL}/api/map/countries/${targetCountry._id}`,
      {
        data: { coordinates: newCoordinates },
        headers: { "Content-Type": "application/json" },
      },
    );

    expect(patchRes.status()).toBe(200);
    const afterRes = await request.get(
      `${API_URL}/api/map/countries?empire=British`,
    );
    const countriesAfter = await afterRes.json();
    const updated = countriesAfter.find(
      (c: any) => c._id === targetCountry._id,
    );
    expect(updated.coordinates).toEqual(newCoordinates);
    console.log(`Coordinates updated to: [${updated.coordinates}]`);

    await request.patch(`${API_URL}/api/map/countries/${targetCountry._id}`, {
      data: { coordinates: originalCoordinates },
      headers: { "Content-Type": "application/json" },
    });
    console.log(` Coordinates restored to: [${originalCoordinates}]`);
  });
});
