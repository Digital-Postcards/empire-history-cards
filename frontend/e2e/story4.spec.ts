import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "test.admin@gmail.com";
const ADMIN_PASSWORD = "hello1234";
const BASE_URL = "http://localhost:3000";
const API_URL = "http://localhost:3002";

async function loginAsAdmin(page: any) {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.locator('input[type="text"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL(`${BASE_URL}/admin/dashboard`, { timeout: 30000 });
    console.log("Logged in as admin");
}

test.describe("Admin Map : Drag and Drop Pin Editor", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test("admin map page is accessible after login", async ({ page }) => {
        await page.goto(`${BASE_URL}/admin/map`);
        await page.waitForLoadState("networkidle");
        await expect(page.locator("text=Map Pin Editor")).toBeVisible({ timeout: 30000 });
        console.log("Admin map page loaded");
    });

    test("empire filter dropdown works and shows pins", async ({ page }) => {
        await page.goto(`${BASE_URL}/admin/map`);
        await page.waitForSelector(".leaflet-container", { timeout: 30000 });
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

    test("dragging a pin updates coordinates in database", async ({ request }) => {
        const countriesRes = await request.get(`${API_URL}/api/map/countries?empire=British`);
        const countries = await countriesRes.json();
        const targetCountry = countries[0];
        const originalCoordinates = [...targetCountry.coordinates];
        console.log(`Original coordinates for ${targetCountry.name}: [${originalCoordinates}]`);
        const newCoordinates = [originalCoordinates[0] + 50, originalCoordinates[1] + 50];

        const patchRes = await request.patch(`${API_URL}/api/map/countries/${targetCountry._id}`, {
            data: { coordinates: newCoordinates },
            headers: { "Content-Type": "application/json" },
        });

        expect(patchRes.status()).toBe(200);
        const afterRes = await request.get(`${API_URL}/api/map/countries?empire=British`);
        const countriesAfter = await afterRes.json();
        const updated = countriesAfter.find((c: any) => c._id === targetCountry._id);
        expect(updated.coordinates).toEqual(newCoordinates);
        console.log(`Coordinates updated to: [${updated.coordinates}]`);

        await request.patch(`${API_URL}/api/map/countries/${targetCountry._id}`, {
            data: { coordinates: originalCoordinates },
            headers: { "Content-Type": "application/json" },
        });
        console.log(`Coordinates restored to: [${originalCoordinates}]`);
    });
});
