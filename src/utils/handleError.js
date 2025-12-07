export function handleError(err, setErrorMessage) {
    let message = "An unexpected error occurred. Please try again.";
    let data = err?.response?.data;

    if (err.status !== 500 && data) {
        if (typeof data === "string") {
            message = data;
        } else if (typeof data === "object") {
            message = data.message || data.error || JSON.stringify(data);
        }
    }

    setErrorMessage(message);
    console.error(err);
}