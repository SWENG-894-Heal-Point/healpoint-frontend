import {expect, test} from "@playwright/test";
import {login} from "./helpers/auth.js";

test('ST-33: Admin can create a doctor’s work schedule.', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'admin@healpoint.com', 'Pass123*');
    expect(token).toBeTruthy();

    const scheduleData = {
        token,
        doctorId: 9,
        workDays: [
            {dayName: "MON", startTime: "08:00", endTime: "16:00"},
            {dayName: "TUE", startTime: "08:00", endTime: "16:00"},
            {dayName: "WED", startTime: "08:00", endTime: "16:00"},
        ]
    };

    const createResponse = await request.post(`${baseURL}/insert-or-update-schedule`,
        {data: scheduleData, headers: {'Content-Type': 'application/json'},}
    );

    expect(createResponse.ok()).toBeTruthy();
    expect(createResponse.status()).toBe(200);

    const getResponse = await request.get(`${baseURL}/get-doctor-schedule`, {
        params: {token: token, doctorId: 9},
        headers: {'Content-Type': 'application/json'}
    });

    expect(getResponse.ok()).toBeTruthy();

    const scheduleList = await getResponse.json();
    expect(Array.isArray(scheduleList)).toBeTruthy();
    expect(scheduleList.length).toBe(3);

    const mondaySchedule = scheduleList.find(s => s.dayName === "MON");
    expect(mondaySchedule).toBeDefined();
    expect(mondaySchedule.startTime).toBe("08:00:00");
    expect(mondaySchedule.endTime).toBe("16:00:00");

    const tuesdaySchedule = scheduleList.find(s => s.dayName === "TUE");
    expect(tuesdaySchedule).toBeDefined();
    expect(tuesdaySchedule.startTime).toBe("08:00:00");
    expect(tuesdaySchedule.endTime).toBe("16:00:00");

    const wednesdaySchedule = scheduleList.find(s => s.dayName === "WED");
    expect(wednesdaySchedule).toBeDefined();
    expect(wednesdaySchedule.startTime).toBe("08:00:00");
    expect(wednesdaySchedule.endTime).toBe("16:00:00");
});

test('ST-35: Admin can update a user’s account status.', async ({request, baseURL}) => {
    // First, log in as target user to verify account is active
    const loginAttemptPass = await request.post(`${baseURL}/authenticate-user`, {
        data: { email: 'stoneg10@email.com', password: 'Pass128*' },
        headers: { 'Content-Type': 'application/json' },
    });
    expect(loginAttemptPass.status()).toBe(200);

    // Now log in as admin to update account status
    const token = await login(request, baseURL, 'admin@healpoint.com', 'Pass123*');
    expect(token).toBeTruthy();

    const payload = {
        token,
        targetUserId: 10,
        isActive: false
    };

    const updateResponse = await request.post(`${baseURL}/admin/account-status`,
        {data: payload, headers: {'Content-Type': 'application/json'},}
    );

    expect(updateResponse.ok()).toBeTruthy();
    expect(updateResponse.status()).toBe(200);

    // Finally, attempt to log in as the target user again to verify account is inactive
    const loginAttemptFail = await request.post(`${baseURL}/authenticate-user`, {
        data: { email: 'stoneg10@email.com', password: 'Pass128*' },
        headers: { 'Content-Type': 'application/json' },
    });

    expect(loginAttemptFail.status()).toBe(403);
    const body = await loginAttemptFail.text();
    expect(body).toContain('This account is inactive');
});