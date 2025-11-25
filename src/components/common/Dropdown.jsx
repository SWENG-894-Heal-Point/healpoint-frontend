export default function Dropdown({className, elementName, label, options, required, defaultValue = ""}) {
    const name = elementName || label.toLowerCase().replace(/\s+/g, "");

    return (
        <div className={`default_dropdown_field ${className || ""}`}>
            <select id={name} name={name} required={required} defaultValue={defaultValue}>
                { defaultValue === "" &&
                    <option value="" disabled defaultChecked hidden>
                        {label}
                    </option>
                }
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
