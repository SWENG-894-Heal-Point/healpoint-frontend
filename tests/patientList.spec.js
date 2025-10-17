import {expect, test} from "@playwright/test";
import {loginUsingUI} from "./helpers/authUI.js";

async function loginAsDoctor(page) {
    await loginUsingUI(page, "brownr@healpoint.com", "Pass123*");
}

async function goToPatientList(page) {
    await page.goto("http://localhost:4173/patients", { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
}

test("ST-19 Doctor can view a list of patients", async ({page}) => {
    await loginAsDoctor(page);
    await goToPatientList(page);

    // Verify that the patient list contains test patients
    await expect(page.getByText("John", {exact: true})).toBeVisible();
    await expect(page.getByText("Jane", {exact: true})).toBeVisible();
    await expect(page.getByText("Michael", {exact: true})).toBeVisible();
    await expect(page.getByText("Emily", {exact: true})).toBeVisible();
});

test("ST-20 Doctor can view a patient profile from the list", async ({page}) => {
    await loginAsDoctor(page);
    await goToPatientList(page);

    // Click the first "View profile" link
    await page.getByText("View profile").first().click();

    // Verify that profile view is displayed
    await expect(page.getByText("Biographical Information")).toBeVisible();
    await expect(page.getByText("Contact")).toBeVisible();
    await expect(page.getByText("Insurance", {exact: true})).toBeVisible();
    await expect(page.getByText("Address")).toBeVisible();
    await expect(page.getByText("Back")).toBeVisible();

    // Verify back button works
    await page.click("button:has-text('Back')");
    await expect(page.getByText("View profile").first()).toBeVisible();
});

test("ST-24 Doctor can view a patient profile using search feature", async ({ page }) => {
    await loginAsDoctor(page);
    await goToPatientList(page);

    // Type into search bar
    await page.fill('input[placeholder="Search..."]', "jane.doe@example.com");
    await page.keyboard.press("Enter");

    // Verify profile view is displayed for searched patient
    await expect(page.getByRole("heading", { name: /Jane Doe/i })).toBeVisible();
    await expect(page.getByText("Biographical Information")).toBeVisible();
    await expect(page.getByText("Contact")).toBeVisible();
    await expect(page.getByText("Insurance", { exact: true })).toBeVisible();
    await expect(page.getByText("Address")).toBeVisible();
});

// TODO: Remove this test
// test("Patient cannot access the patient list page", async ({ page }) => {
//     // Log in as a Patient
//     await login(page, "jane.doe@example.com", "Pass125*");
//
//     // Try to go to Patient List Page
//     await page.goto("http://localhost:4173/patients");
//     await page.waitForTimeout(1000);
//
//     // Verify access denied message is shown
//     await expect(page.getByText(/Access denied/i)).toBeVisible();
// });