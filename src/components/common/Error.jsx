export default function Error({message, customClass = ""}) {
    if (!message) return null;

    return (
        <p className={`default_error ${customClass}`}>
            {message}
        </p>
    );
}