export function formatDate(dateInput, isFormat = false) {
    if (!dateInput) return '';
    const [year, month, day] = dateInput.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);

    if (isFormat) {
        return localDate.toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    } else {
        return localDate;
    }
}