import {test, expect} from "@playwright/test";

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