import {test, expect} from "@playwright/test";

test.describe("ST-3 Valid Login Flow", () => {
    test.beforeEach(async ({page}) => {
        await page.goto("http://localhost:4173/login");
    });

    test("User can log in with valid credentials and reach dashboard", async ({page}) => {
        // Fill in valid email + password
        await page.fill('input[name="email"]', "jane.doe@example.com");
        await page.fill('input[name="password"]', "Pass125*");

        // Capture the /authenticate-user response while clicking Login
        const [response] = await Promise.all([
            page.waitForResponse(resp =>
                resp.url().includes("/authenticate-user") && resp.status() === 200
            ),
            page.click("button[type='submit']")
        ]);

        // Verify the token is not empty
        const token = await response.text();
        expect(token).not.toBeNull();
        expect(token).not.toBe("");

        await expect(page).toHaveURL("http://localhost:4173/");
    });
});

test.describe("ST-4 Invalid Login with Incorrect Password", () => {
    test.beforeEach(async ({page}) => {
        await page.goto("http://localhost:4173/login"); // adjust URL if needed
    });

    test("User cannot log in with incorrect password", async ({page}) => {
        // Fill in valid email but wrong password
        await page.fill('input[name="email"]', "john.smith@example.com");
        await page.fill('input[name="password"]', "WrongPassword!");

        // Capture the /authenticate-user response
        const [response] = await Promise.all([
            page.waitForResponse(resp =>
                resp.url().includes("/authenticate-user") && resp.status() === 401
            ),
            page.click("button[type='submit']")
        ]);

        // Backend should respond with error message
        const errorMessage = await response.text();
        expect(errorMessage).toContain("Incorrect password. Please try again.");

        // Verify user is still on login page (not redirected)
        await expect(page).toHaveURL("http://localhost:4173/login");
    });
});

test.describe("ST-11 Login Form Required Fields", () => {
    test.beforeEach(async ({page}) => {
        await page.goto("http://localhost:4173/login");
    });

    test("Empty email with valid password", async ({page}) => {
        await page.fill('input[name="email"]', "");
        await page.fill('input[name="password"]', "ValidPassword123!");

        const [validationMessage] = await Promise.all([
            page.locator('input[name="email"]').evaluate(
                (input) => input.validationMessage
            ),
            page.click("button[type='submit']")
        ]);

        expect(validationMessage).toBe("Please fill out this field.");
    });

    test("Empty password with valid email", async ({page}) => {
        await page.fill('input[name="email"]', "valid@email.com");
        await page.fill('input[name="password"]', "");

        const [validationMessage] = await Promise.all([
            page.locator('input[name="password"]').evaluate(
                (input) => input.validationMessage
            ),
            page.click("button[type='submit']")
        ]);

        expect(validationMessage).toBe("Please fill out this field.");
    });
});

