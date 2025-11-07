import {expect, test} from "@playwright/test";
import {login} from "./helpers/auth.js";


test('ST-28: Patient can access all appointments', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'jane.doe@example.com', 'Pass125*');
    expect(token).toBeTruthy();

    // Request the user’s appointments using the token
    const appointmentResponse = await request.get(`${baseURL}/get-my-appointments`, {
        params: {token: token},
        headers: {'Content-Type': 'application/json'}
    });

    expect(appointmentResponse.ok()).toBeTruthy();
    const appointmentList = await appointmentResponse.json();

    // Verify the appointment list is empty
    expect(Array.isArray(appointmentList)).toBeTruthy();
    expect(appointmentList.length).toBe(4);

    // verify there is at least one upcoming and one past appointment
    const upcomingAppointments = appointmentList.filter(a => a.status === "SCHEDULED");
    const pastAppointments = appointmentList.filter(a => a.status === "COMPLETED");
    expect(upcomingAppointments.length).toBeGreaterThan(0);
    expect(pastAppointments.length).toBeGreaterThan(0);

    // Verify the structure of an appointment object
    const firstAppointment = appointmentList[0];
    expect(firstAppointment).toHaveProperty('id');
    expect(firstAppointment).toHaveProperty('doctor');
    expect(firstAppointment).toHaveProperty('patient');
    expect(firstAppointment).toHaveProperty('appointmentDate');
    expect(firstAppointment).toHaveProperty('startTime');
    expect(firstAppointment).toHaveProperty('endTime');
    expect(firstAppointment).toHaveProperty('reason');
    expect(firstAppointment).toHaveProperty('status');
});

test('ST-32: Display correct message when user has no appointments', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'john.smith@example.com', 'Pass124*');
    expect(token).toBeTruthy();

    // Request the user’s appointments using the token
    const appointmentResponse = await request.get(`${baseURL}/get-my-appointments`, {
        params: {token: token},
        headers: {'Content-Type': 'application/json'}
    });

    expect(appointmentResponse.ok()).toBeTruthy();
    const appointmentList = await appointmentResponse.json();

    // Verify the appointment list is empty
    expect(Array.isArray(appointmentList)).toBeTruthy();
    expect(appointmentList.length).toBe(0);
});

