import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {Alert, Snackbar} from "@mui/material";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import Layout from "@/components/common/Layout.jsx";
import PrescriptionTable from "@/components/prescription/PrescriptionTable.jsx";
import PrescriptionHeader from "@/components/prescription/PrescriptionHeader.jsx";
import PrescriptionInstruction from "@/components/prescription/PrescriptionInstruction.jsx";
import DoctorPrescriptionActions from "@/components/prescription/DoctorPrescriptionActions.jsx";
import RefillPrescriptionModal from "@/components/prescription/RefillPrescriptionModal.jsx";
import {handleError} from "@/utils/handleError.js";
import {parseJwt} from "@/utils/parseJwt.js";

export default function PrescriptionPage() {
    const [prescriptionData, setPrescriptionData] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [prescriptionItems, setPrescriptionItems] = useState([]);
    const [instruction, setInstruction] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [editable, setEditable] = useState(false);
    const [error, setError] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    const decoded = parseJwt(authToken);
    const role = decoded?.role;

    const {state} = useLocation();
    const profileId = state ? state.patientId : 0;

    function validateChanges(items) {
        for (const item of items) {
            if (!item.medication || item.dosage == null || item.frequency == null || item.duration == null || item.fillsLeft == null) {
                return "All fields are required.";
            }
            if (item.dosage <= 0 || item.frequency <= 0 || item.duration <= 0 || item.fillsLeft < 0) {
                return "Dosage, frequency, and duration must be positive numbers. Fills left cannot be negative.";
            }
        }
        return null;
    }

    function updateData(data) {
        setPrescriptionData(data);
        setPatientData(data.patient);
        setPrescriptionItems(data.prescriptionItems);
        setInstruction(data.instruction);
        setLastUpdated(data.updatedAt || data.createdAt);
    }

    useEffect(() => {
        axios.get("/get-patient-prescription", {
            params: {token: authToken, patientId: profileId},
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                updateData(response.data);
            }
        }).catch((err) => {
            handleError(err, setError)
            setPrescriptionData(null);
        });
    }, []);

    function handleSave() {
        const invalid = validateChanges(prescriptionItems);
        if (invalid) {
            setError(invalid);
            return;
        }

        const payload = {
            token: authToken,
            patientId: profileId,
            instruction: instruction,
            prescriptionItems: prescriptionItems
        }

        axios.post("/create-or-update-prescription", payload, {
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                updateData(response.data);
                setEditable(false);
            }
        }).catch((err) => {
            handleError(err, setError);
        });
    }

    function handleCancel() {
        if (prescriptionData) {
            setPrescriptionItems(prescriptionData.prescriptionItems);
            setInstruction(prescriptionData.instruction);
        }
        setEditable(false);
    }

    return (
        <>
            <Layout>
                <div>
                    <PrescriptionHeader patientData={patientData} lastUpdated={lastUpdated}/>
                    <PrescriptionTable items={prescriptionItems} setItems={setPrescriptionItems} editable={editable}/>
                    <PrescriptionInstruction instruction={instruction} setInstruction={setInstruction}
                                             editable={editable}/>
                    <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}
                              anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                        <Alert severity="error" sx={{width: "100%"}}>{error}</Alert>
                    </Snackbar>
                    {role.toLowerCase() === "patient" ?
                        <RefillPrescriptionModal items={prescriptionItems}/>
                        :
                        <DoctorPrescriptionActions editable={editable} onEdit={() => setEditable(true)}
                                                   onCancel={handleCancel} onSave={handleSave}
                                                   hasPrescription={prescriptionItems.length > 0}/>
                    }
                </div>
            </Layout>
        </>
    );
};