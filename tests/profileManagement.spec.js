import {test, expect} from "@playwright/test";

test.describe("ST-5 Patients cannot access Doctor-only functionality", () => {
    test("Patient cannot update a doctor's NPI number", async ({ request, baseURL }) => {
        // Log in as Patient
        const loginRes = await request.post(`${baseURL}/authenticate-user`, {
            data: {
                email: "emiDavis@email.com",   // existing patient
                password: "Pass127*"
            },
            headers: { "Content-Type": "application/json" }
        });

        expect(loginRes.ok()).toBeTruthy();
        const patientToken = await loginRes.text();
        expect(patientToken).not.toBeNull();
        expect(patientToken).not.toBe("");

        // Try updating a doctor's NPI number using patient token
        const updateRes = await request.post(`${baseURL}/update-my-profile`, {
            data: {
                token: patientToken,
                role: "Doctor",
                gender: 'Male',
                email: 'brownr@healpoint.com',
                phone: '5551234567',
                medicalDegree: 'MD',
                specialty: 'Cardiology',
                npiNumber: "9876543210",
            },
            headers: { "Content-Type": "application/json" }
        });

        expect(updateRes.status()).not.toBe(200);
        const errorMessage = await updateRes.text();
        expect(errorMessage).toContain("Update failed");
    });
});

test.describe("ST-6 Patients cannot access Doctor-only functionality", () => {
    test("Doctor cannot update a patient's gender", async ({ request, baseURL }) => {
        // Log in as Patient
        const loginRes = await request.post(`${baseURL}/authenticate-user`, {
            data: {
                email: "millers@healpoint.com",   // existing patient
                password: "Pass123*"
            },
            headers: { "Content-Type": "application/json" }
        });

        expect(loginRes.ok()).toBeTruthy();
        const doctorToken = await loginRes.text();
        expect(doctorToken).not.toBeNull();
        expect(doctorToken).not.toBe("");

        // Try updating a doctor's NPI number using patient token
        const updateRes = await request.post(`${baseURL}/update-my-profile`, {
            data: {
                token: doctorToken,
                role: "Patient",
                gender: 'Male',
                email: 'jane.doe@example.com',
                phone: '5551234567',
                streetAddress: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zipCode: '12345',
            },
            headers: { "Content-Type": "application/json" }
        });

        expect(updateRes.status()).not.toBe(200);
        const errorMessage = await updateRes.text();
        expect(errorMessage).toContain("Update failed");
    });
});

test.describe("ST-7 Logged-in user updates profile field", () => {
    test("User can update phone number and see it persist after reload", async ({ page }) => {
        await page.goto("http://localhost:4173/login");
        await page.fill('input[name="email"]', "jane.doe@example.com");
        await page.fill('input[name="password"]', "Pass125*");
        await page.click("button[type='submit']");
        await page.waitForTimeout(3000);

        // Go to account page
        await page.goto("http://localhost:4173/account");
        // await page.waitForTimeout(1000);
        await expect(page.locator("h2")).toContainText("Jane Doe");

        // Go to update account page
        await page.click("text=Edit");
        await expect(page).toHaveURL("http://localhost:4173/update-account");

        // Change phone number
        const newPhone = "5551234567"; // backend expects digits only
        await page.fill('input[name="phone"]', newPhone);
        await page.click('button[type="submit"]');

        // After save, user should return to /account and see updated phone
        await expect(page).toHaveURL("http://localhost:4173/account");
        await expect(page.getByText(newPhone)).toBeVisible();

        // Refresh to confirm persistence
        await page.reload();
        await expect(page.getByText(newPhone)).toBeVisible();
    });
});

test.describe("ST-12 Patients cannot access other patients' profiles", () => {
    test("Patient A cannot access Patient B's profile", async ({request, baseURL}) => {
        // Log in as Patient A
        const loginRes = await request.post(`${baseURL}/authenticate-user`, {
            data: {
                email: "mikej@email.com",
                password: "Pass126*"
            },
            headers: {"Content-Type": "application/json"}
        });

        const patientAToken = await loginRes.text();
        expect(patientAToken).not.toBeNull();

        // Try to fetch Patient B's profile
        const getProfileRes = await request.post(`${baseURL}/get-patient-profile`, {
            data: {
                token: patientAToken,
                email: "jane.doe@example.com"
            },
            headers: {"Content-Type": "application/json"}
        });

        // Expected: Access denied
        expect(getProfileRes.status()).not.toBe(200);
        const errorMessage = await getProfileRes.text();
        expect(errorMessage).toContain("Access denied");
    });
});

test.describe("ST-13 Doctor can access patient profiles", () => {
    test("Doctor is able to view Patient B's profile", async ({ request , baseURL}) => {
        // Step 1: Log in as Doctor
        const loginRes = await request.post(`${baseURL}/authenticate-user`, {
            data: {
                email: "brownr@healpoint.com",
                password: "Pass123*"
            },
            headers: { "Content-Type": "application/json" }
        });

        expect(loginRes.ok()).toBeTruthy();
        const doctorToken = await loginRes.text();
        expect(doctorToken).not.toBeNull();

        // Step 2: Use doctor's token to fetch Patient B's profile
        const getProfileRes = await request.post(`${baseURL}/get-patient-profile`, {
            data: {
                token: doctorToken,
                email: "jane.doe@example.com"
            },
            headers: { "Content-Type": "application/json" }
        });

        // Expected: Doctor can access patient info
        expect(getProfileRes.status()).toBe(200);

        const profileData = await getProfileRes.json();
        expect(profileData).toHaveProperty("email", "jane.doe@example.com");
        expect(profileData).toHaveProperty("firstName", "Jane");
        expect(profileData).toHaveProperty("lastName", "Doe");
    });
});