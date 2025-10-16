import {expect, test} from "@playwright/test";
import {login} from "./helpers/auth.js";

test('ST-16: Patient can view own prescription', async ({ request, baseURL }) => {
    const token = await login(request, baseURL, 'emiDavis@email.com', 'Pass127*');
    expect(token).toBeTruthy();

    // Request the patient’s prescription using the token ---
    const prescriptionResponse = await request.get(`${baseURL}/get-patient-prescription`, {
        params: { token:token, patientId: 0 },
        headers: { 'Content-Type': 'application/json' }
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
