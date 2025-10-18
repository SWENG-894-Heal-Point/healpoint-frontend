export async function login(request, baseURL, email, password) {
    const res = await request.post(`${baseURL}/authenticate-user`, {
        data: { email: email, password: password },
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok()) {
        const body = await res.text();
        throw new Error(`Auth failed: ${res.status()} - ${body}`);
    }

    return await res.text();
}