export function formatTime(time24) {
    const [hour, minute] = time24.split(":").map(Number);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}