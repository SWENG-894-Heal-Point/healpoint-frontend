import {expect, test} from "@playwright/test";
import {loginUsingUI} from "./helpers/authUI.js";


test("ST-25 Patient can access a list of doctors", async ({request, baseURL}) => {
    const response = await request.get(`${baseURL}/get-all-doctors`, {headers: {'Content-Type': 'application/json'},});
    expect(response.ok()).toBeTruthy();

    // Verify that the response contains at least two doctors
    const doctors = await response.json();
    expect(doctors.length).toBeGreaterThanOrEqual(2);

    // Verify that the response contains test doctors
    const doctorFirstNames = doctors.map(doc => doc.firstName);
    expect(doctorFirstNames).toContain("Robert");
    expect(doctorFirstNames).toContain("Sarah");
});

test("ST-29 Patient can view a doctor profile using search feature", async ({page}) => {
    await loginUsingUI(page, "john.smith@example.com", "Pass124*");
    await page.goto("http://localhost:4173/doctors", {waitUntil: 'networkidle'});
    await page.waitForTimeout(2000);

    // Type into search bar
    await page.fill('input[placeholder="Search..."]', "Pediatrics");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    // Verify that the search results contain the expected doctor
    await expect(page.getByText("Sarah", {exact: true})).toBeVisible();
    await expect(page.getByText("Robert", {exact: true})).not.toBeVisible();

    // Search by email
    await page.fill('input[placeholder="Search..."]', "millers@healpoint.com");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    // Verify that profile view is displayed
    await expect(page.getByText("Biographical Information")).toBeVisible();
    await expect(page.getByText("Contact")).toBeVisible();
    await expect(page.getByText("More About Dr. Miller")).toBeVisible();
});
