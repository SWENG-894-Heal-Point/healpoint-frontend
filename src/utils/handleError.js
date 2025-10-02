export function handleError(err, setErrorMessage) {
    if (err.status !== 500 && err.response && err.response.data) {
        setErrorMessage(err.response.data);
    } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
    }
    console.error(err);
}