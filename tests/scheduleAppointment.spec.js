import {expect, test} from "@playwright/test";
import {login} from "./helpers/auth.js";

test('ST-26: Patient can successfully schedule an appointment', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'mikej@email.com', 'Pass126*');
    expect(token).toBeTruthy();

    // Request the user’s appointments using the token
    const payload = {
        token,
        appointmentDate: "2025-12-19",
        doctorId: 3,
        appointmentTime: "14:00",
        reason: "Follow-up visit"
    };

    const scheduleResponse = await request.post(`${baseURL}/schedule-appointment`, {
        data: payload, headers: {'Content-Type': 'application/json'}
    });

    expect(scheduleResponse.ok()).toBeTruthy();
    expect(scheduleResponse.status()).toBe(200);

    // Request the user’s appointments using the token
    const appointmentResponse = await request.get(`${baseURL}/get-my-appointments`, {
        params: {token: token},
        headers: {'Content-Type': 'application/json'}
    });

    expect(appointmentResponse.ok()).toBeTruthy();
    const appointmentList = await appointmentResponse.json();

    // Verify the appointment list is not empty
    expect(Array.isArray(appointmentList)).toBeTruthy();
    const scheduledAppointment = appointmentList.find(a => a.appointmentDate === "2025-12-19" && a.startTime === "14:00" && a.doctor.id === 3);
    expect(scheduledAppointment).toBeDefined();
    expect(scheduledAppointment.reason).toBe("Follow-up visit");
    expect(scheduledAppointment.status).toBe("SCHEDULED");
});

test('ST-30: Verify appointment slots filtered by selected provider', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'mikej@email.com', 'Pass126*');
    expect(token).toBeTruthy();

    // Request available appointment dates
    const slotsResponse = await request.get(`${baseURL}/available-appointment-slots`, {
        params: {token: token, date: "2025-12-18", doctorIds: [2]},
        headers: {'Content-Type': 'application/json'}
    });

    expect(slotsResponse.ok()).toBeTruthy();
    const slotsData = await slotsResponse.json();

    // Verify the slots are only for the selected provider (doctorId: 2)
    expect(Array.isArray(slotsData)).toBeTruthy();
    expect(slotsData.length).toBeGreaterThan(0);
    slotsData.forEach(item => {
        expect(item.doctor.id).toBe(2);
    });
});
