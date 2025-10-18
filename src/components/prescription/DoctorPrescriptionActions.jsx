export default function DoctorPrescriptionActions({editable, onEdit, onSave, onCancel, hasPrescription}) {
    return (
        <div className="default_btn_group">
            {editable ? (
                <>
                    <button className="default_btn" onClick={onCancel}>Cancel</button>
                    <button className="default_btn" onClick={onSave}>Save</button>
                </>
            ) : (
                <button className="default_btn" onClick={onEdit}>
                    {hasPrescription ? "Edit Prescription" : "New Prescription"}
                </button>
            )}
        </div>
    );
}