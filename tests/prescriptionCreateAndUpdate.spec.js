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

test('ST-15: Doctor edits existing prescription', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'brownr@healpoint.com', 'Pass123*');
    expect(token).not.toBeNull();

    const updatedPrescriptionData = {
        token,
        patientId: 6,
        instruction: 'Take after meals',
        prescriptionItems: [
            {itemNumber: 1, medication: 'MedB', dosage: 200, frequency: 3, duration: 14, fillsLeft: 1},
            {itemNumber: 2, medication: 'MedC', dosage: 500, frequency: 2, duration: 60, fillsLeft: 2},
        ],
    };

    const updateResponse = await request.post(`${baseURL}/create-or-update-prescription`,
        {data: updatedPrescriptionData, headers: {'Content-Type': 'application/json'},}
    );

    expect(updateResponse.ok()).toBeTruthy();
    const responseBody = await updateResponse.json();

    expect(responseBody).toHaveProperty('prescriptionItems');
    const medications = responseBody.prescriptionItems.map((i) => i.medication);
    expect(medications).toContain('MedB');
    expect(medications).toContain('MedC');

    const medB = responseBody.prescriptionItems.find((i) => i.medication === 'MedB');
    expect(medB.dosage).toBe(200);
    expect(medB.frequency).toBe(3);
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

test('ST-22: Verify patient cannot modify prescriptions', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'mikej@email.com', 'Pass126*');
    expect(token).not.toBeNull();

    const updatedPrescriptionData = {
        token,
        patientId: 6,
        instruction: 'Take after meals',
        prescriptionItems: [
            {itemNumber: 1, medication: 'MedB', dosage: 200, frequency: 3, duration: 14, fillsLeft: 1},
            {itemNumber: 2, medication: 'MedC', dosage: 500, frequency: 2, duration: 60, fillsLeft: 2},
        ],
    };

    const updateResponse = await request.post(`${baseURL}/create-or-update-prescription`,
        {data: updatedPrescriptionData, headers: {'Content-Type': 'application/json'},}
    );

    expect(updateResponse.status()).toBe(401); // Unauthorized
    const body = await updateResponse.text();
    expect(body).toContain('Access denied');
});