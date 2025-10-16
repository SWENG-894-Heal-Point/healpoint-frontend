export async function loginUsingUI(page, email, password) {
    await page.goto("http://localhost:4173/login", { waitUntil: 'networkidle' });

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click("button[type='submit']");
    await page.waitForTimeout(1000);
}