import { test, expect } from '@playwright/test';

test('successful-registration', async ({ page }) => {
    await page.goto('http://localhost:4173/signup');

    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Account created successfully! Please log in.');
        await dialog.dismiss();
    })

    // Fill out first page of the registration form
    await page.fill('input[name="email"]', 'st1.patient@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.check('input[type="radio"][value="patient"]');
    await page.click('button[type="submit"]');

    // Fill out second page of the registration form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="dateOfBirth"]', '1990-01-01');
    await page.selectOption('select[name="gender"]', 'male');
    await page.fill('input[name="phone"]', '2158881234');
    await page.fill('input[name="streetAddress"]', '12 Example St');
    await page.fill('input[name="city"]', 'New Town');
    await page.selectOption('select[name="state"]', 'PA');
    await page.fill('input[name="zipCode"]', '19104');
    await page.fill('input[name="insuranceProvider"]', 'Aetna');
    await page.fill('input[name="insuranceId"]', '123456789');
    await page.click('button[type="submit"]');
})

test('reject-existing-email', async ({ page }) => {
    await page.goto('http://localhost:4173/signup');

    // Fill out first page of the registration form
    await page.fill('input[name="email"]', 'jane.doe@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.check('input[type="radio"][value="patient"]');
    await page.click('button[type="submit"]');

    // Verify that the user is stays on the signup page and sees an error message
    await expect(page.getByText('Are you a patient or doctor?')).toBeVisible();
    await expect(page.getByText('An account with this email already exists.')).toBeVisible();
});

test('unauthorized-employee', async ({ page }) => {
    await page.goto('http://localhost:4173/signup');

    // Fill out first page of the registration form
    await page.fill('input[name="email"]', 'st10.doctor@healpoint.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.check('input[type="radio"][value="doctor"]');
    await page.click('button[type="submit"]');

    // Fill out second page of the registration form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="dateOfBirth"]', '1990-01-01');
    await page.selectOption('select[name="gender"]', 'male');
    await page.fill('input[name="phone"]', '2155551234');
    await page.fill('input[name="medicalDegree"]', 'MD');
    await page.fill('input[name="specialty"]', 'Cardiology');
    await page.fill('input[name="npiNumber"]', '1234567890');
    await page.fill('input[name="experience"]', '10');
    await page.fill('input[name="languages"]', 'English, Spanish');
    await page.click('button[type="submit"]');

    await expect(page.getByText('The provided employee email does not exist in the system.')).toBeVisible({ timeout: 3000 });
});

test('authorized-employee', async ({ page }) => {
    await page.goto('http://localhost:4173/signup');

    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Account created successfully! Please log in.');
        await dialog.dismiss();
    })

    // Fill out first page of the registration form
    await page.fill('input[name="email"]', 'authorized.doctoc1@healpoint.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.check('input[type="radio"][value="doctor"]');
    await page.click('button[type="submit"]');

    // Fill out second page of the registration form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="dateOfBirth"]', '1990-01-01');
    await page.selectOption('select[name="gender"]', 'male');
    await page.fill('input[name="phone"]', '2155551234');
    await page.fill('input[name="medicalDegree"]', 'MD');
    await page.fill('input[name="specialty"]', 'Cardiology');
    await page.fill('input[name="npiNumber"]', '1234567890');
    await page.fill('input[name="experience"]', '10');
    await page.fill('input[name="languages"]', 'English, Spanish');
    await page.click('button[type="submit"]');
});