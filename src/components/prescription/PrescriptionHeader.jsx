import style from "@/styles/prescription.module.css";

export default function PrescriptionTable({patientData, lastUpdated}) {
    return (
        <div className={style.prescription_header}>
            <div>
                {patientData &&
                    <>
                        <h2>{patientData.firstName} {patientData.lastName}</h2>
                        <p>Date of Birth: {patientData.dateOfBirth}</p>
                        <p>Gender: {patientData.gender}</p>
                    </>}
            </div>
            <div>
                {lastUpdated &&
                    <>
                        <p>Last Updated</p>
                        <p>{new Date(lastUpdated).toLocaleDateString()}</p>
                    </>}
            </div>
        </div>
    );
}