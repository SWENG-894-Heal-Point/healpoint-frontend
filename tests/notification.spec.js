import {expect, test} from "@playwright/test";
import {login} from "./helpers/auth.js";

test('ST-34: User can access all notifications', async ({request, baseURL}) => {
    const token = await login(request, baseURL, 'brownr@healpoint.com', 'Pass123*');
    expect(token).toBeTruthy();

    // Request the user’s notifications using the token
    const notificationResponse = await request.get(`${baseURL}/get-my-notifications`, {
        params: {token: token},
        headers: {'Content-Type': 'application/json'}
    });

    expect(notificationResponse.ok()).toBeTruthy();
    const notificationList = await notificationResponse.json();

    // Verify the notification list is not empty
    expect(Array.isArray(notificationList)).toBeTruthy();
    expect(notificationList.length).toBeGreaterThanOrEqual(6);

    // Verify the structure of a notification object
    const firstNotification = notificationList[0];
    expect(firstNotification).toHaveProperty('id');
    expect(firstNotification).toHaveProperty('message');
    expect(firstNotification).toHaveProperty('createdAt');
    expect(firstNotification).toHaveProperty('isRead');
});