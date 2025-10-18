import style from "@/styles/prescription.module.css";

export default function PrescriptionInstruction({instruction, setInstruction, editable}) {
    return (
        instruction &&
        <div className={style.instruction_container}>
            <p className={style.section_title}>Instruction:</p>
            <input
                type="text"
                placeholder=""
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                readOnly={!editable}
            />
        </div>
    );
}