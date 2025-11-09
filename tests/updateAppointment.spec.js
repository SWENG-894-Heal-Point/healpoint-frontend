import { test, expect } from '@playwright/test';
import {login} from "./helpers/auth.js";
import {loginUsingUI} from "./helpers/authUI.js";

test('ST-27: Patient reschedules an appointment', async ({ request, baseURL }) => {
    // Authenticate user
    const token = await login(request, baseURL, 'emiDavis@email.com', 'Pass127*');
    expect(token).toBeTruthy();

    // Reschedule appointment
    const rescheduleResponse = await request.post(`${baseURL}/update-appointment`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            token,
            appointmentId: 8,
            appointmentDate: '2025-12-23',
            appointmentTime: '11:00'
        }
    });

    expect(rescheduleResponse.ok()).toBeTruthy();
    expect(rescheduleResponse.status()).toBe(200);

    // Request the user’s appointments using the token
    const appointmentResponse = await request.get(`${baseURL}/get-my-appointments`, {
        params: {token: token},
        headers: {'Content-Type': 'application/json'}
    });

    expect(appointmentResponse.ok()).toBeTruthy();
    const appointmentList = await appointmentResponse.json();

    // Verify updated appointment
    expect(Array.isArray(appointmentList)).toBeTruthy();
    const scheduledAppointment = appointmentList.find(a => a.id === 8);
    expect(scheduledAppointment).toBeDefined();
    expect(scheduledAppointment.appointmentDate).toBe('2025-12-23');
    expect(scheduledAppointment.startTime).toBe('11:00');
});


test('ST-31: Patient cannot change doctor or reason when rescheduling', async ({ page }) => {
    await loginUsingUI(page, "jane.doe@example.com", "Pass125*");
    await page.goto("http://localhost:4173/appointments", {waitUntil: 'networkidle'});
    await page.waitForTimeout(2000);

    // Select a future appointment and click "Reschedule"
    await page.getByText("Reschedule").first().click();

    // Verify navigation to rescheduling page
    await expect(page).toHaveURL(/reschedule-appointment/i);

    // Verify no doctor or reason-for-visit fields are visible
    await expect(page.getByText("Providers", {exact: true})).not.toBeVisible();
    await expect(page.getByText("Reason for visit", {exact: true})).not.toBeVisible();
});

