import {expect, test} from "@playwright/test";

async function login(request, baseURL, email, password) {
    const authResponse = await request.post(`${baseURL}/authenticate-user`, {
        data: {
            email: email,
            password: password,
        },
        headers: {'Content-Type': 'application/json'},
    });

    expect(authResponse.ok()).toBeTruthy();
    return await authResponse.text();
}

test('ST-14: Doctor creates a new prescription', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'brownr@healpoint.com', 'Pass123*');
    expect(token).not.toBeNull();

    const prescriptionData = {
        token,
        patientId: 4,
        instruction: 'Take with food',
        prescriptionItems: [{itemNumber: 1, medication: 'MedA', dosage: 500, frequency: 3, duration: 7, fillsLeft: 1},],
    };

    const createResponse = await request.post(`${baseURL}/create-or-update-prescription`,
        {data: prescriptionData, headers: {'Content-Type': 'application/json'},}
    );

    expect(createResponse.ok()).toBeTruthy();

    const responseBody = await createResponse.json();
    expect(responseBody).toHaveProperty('prescriptionItems');
    expect(responseBody.prescriptionItems[0].medication).toBe('MedA');
});

test('ST-21: Verify non-doctor cannot create prescriptions', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'support.staff@healpoint.com', 'Pass123*');
    expect(token).not.toBeNull();

    const unauthorizedPrescriptionData = {
        token,
        patientId: 5,
        instruction: 'Take with food',
        prescriptionItems: [{itemNumber: 1, medication: 'MedA', dosage: 500, frequency: 3, duration: 7, fillsLeft: 1},],
    };

    const createResponse = await request.post(`${baseURL}/create-or-update-prescription`,
        {data: unauthorizedPrescriptionData, headers: {'Content-Type': 'application/json'},}
    );

    expect(createResponse.status()).toBe(401); // Unauthorized
    const body = await createResponse.text();
    expect(body).toContain('Access denied');
});