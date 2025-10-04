export function transformText(text, mode) {
    if (!text) return "";

    switch (mode) {
        case 'upper':
            return text.toUpperCase();

        case 'lower':
            return text.toLowerCase();

        case "sentence":
            return text
                .toLowerCase()
                .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());

        case 'title':
            return text
                .toLowerCase()
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

        default:
            return text;
    }
}