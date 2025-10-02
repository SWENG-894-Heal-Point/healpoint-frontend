import { Field } from "formik";

export default function Dropdown({ className, label, options, required }) {
    const name = label.toLowerCase().replace(/\s+/g, "");

    return (
        <div className={`default_dropdown_field ${className || ""}`}>
            <Field as="select" id={name} name={name} required={required}>
                <option value="" disabled defaultChecked hidden>
                    {label}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </Field>
        </div>
    );
}
