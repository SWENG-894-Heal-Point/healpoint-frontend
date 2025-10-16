import {expect, test} from "@playwright/test";
import {login} from "./helpers/auth.js";
import {loginUsingUI} from "./helpers/authUI.js";

test('ST-16: Patient can view own prescription', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'emiDavis@email.com', 'Pass127*');
    expect(token).toBeTruthy();

    // Request the patient’s prescription using the token ---
    const prescriptionResponse = await request.get(`${baseURL}/get-patient-prescription`, {
        params: {token: token, patientId: 0},
        headers: {'Content-Type': 'application/json'}
    });

    expect(prescriptionResponse.ok()).toBeTruthy();
    const prescriptionData = await prescriptionResponse.json();

    // --- Step 3: Verify the prescription data belongs to the authenticated patient ---
    expect(prescriptionData).toHaveProperty('patient');
    expect(prescriptionData.patient.lastName).toBe('Davis');
    expect(prescriptionData).toHaveProperty('prescriptionItems');
    expect(Array.isArray(prescriptionData.prescriptionItems)).toBeTruthy();
    expect(prescriptionData.prescriptionItems[0].medication).toBe('Omeprazole');
});

test('ST-17: Patient submits refill request successfully', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'emiDavis@email.com', 'Pass127*');
    expect(token).toBeTruthy();

    // Request the patient’s prescription using the token ---
    const refillResponse = await request.post(`${baseURL}/request-prescription-refill`, {
        data: {token: token, medications: ['Omeprazole', 'Lisinopril']},
        headers: {'Content-Type': 'application/json'}
    });

    expect(refillResponse.ok()).toBeTruthy();
    const bodyText = await refillResponse.text();
    expect(bodyText).toContain('Refill request submitted successfully');
});

test.describe('ST-18: Refill prescription is disabled for patients with no prescriptions', () => {
    test('Request Refill button hidden for patients with no prescriptions', async ({page}) => {
        // Login as a patient and navigate to prescription page
        await loginUsingUI(page, 'jane.doe@example.com', 'Pass125*');
        await page.goto('http://localhost:4173/prescription', {waitUntil: 'networkidle'});
        await page.waitForTimeout(2000);

        // Verify that the Request Refill button is hidden or disabled
        const refillButton = page.locator('button', { hasText: 'Request Refill' });
        const count = await refillButton.count();
        expect(count).toBe(0);
    });

    test('Backend endpoint restricts refill for patients with no prescriptions', async ({request, baseURL}) => {
        // Attempt to call refill API directly (negative case)
        const token = await login(request, baseURL, 'jane.doe@example.com', 'Pass125*');
        expect(token).toBeTruthy();

        const refillAttempt = await request.post(`${baseURL}/request-prescription-refill`, {
            data: {token: token, medications: ['MedA', 'MedB']},
            headers: {'Content-Type': 'application/json'}
        });

        // Expect backend to reject with appropriate error
        expect(refillAttempt.status()).toBeGreaterThanOrEqual(400);
        const errorMsg = await refillAttempt.text();
        expect(errorMsg).toMatch("No existing prescription found for patientId=5");
    });
});

test('ST-23: Doctor cannot submit refill request', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'millers@healpoint.com', 'Pass123*');
    expect(token).toBeTruthy();

    // Request the patient’s prescription using the token ---
    const refillAttempt = await request.post(`${baseURL}/request-prescription-refill`, {
        data: {token: token, medications: ['Omeprazole', 'Lisinopril']},
        headers: {'Content-Type': 'application/json'}
    });

    expect(refillAttempt.status()).toBe(400);
    const errorMessage = await refillAttempt.text();
    expect(errorMessage).toMatch("Patient with ID 3 not found");
});