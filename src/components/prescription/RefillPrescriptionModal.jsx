import {Box, Modal, FormGroup, FormControlLabel, Checkbox} from "@mui/material";
import {useState} from "react";
import secureLocalStorage from "react-secure-storage";

import style from "@/styles/prescription.module.css";
import axios from "axios";
import {handleError} from "@/utils/handleError.js";

export default function RefillPrescriptionModal({items}) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedMedications, setSelectedMedications] = useState([]);
    const [error, setError] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    function handleCheckboxChange(e) {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedMedications(prev => [...prev, value]);
        } else {
            setSelectedMedications(prev => prev.filter(med => med !== value));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (selectedMedications.length === 0) {
            setError("Please select at least one medication.");
            return;
        }

        setError("");

        axios.post("/request-prescription-refill", {token:authToken, medications:selectedMedications}, {
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                alert(response.data);
                setSelectedMedications([]);
                setOpenModal(false);
            }
        }).catch((err) => {
            handleError(err, setError);
        });
    }

    function handleClose() {
        setError("");
        setOpenModal(false);
    }

    return (
        <>
            {items.length > 0 &&
                <div className="default_btn_group">
                    <button className="default_btn" onClick={() => setOpenModal(true)}>Request Refill</button>
                </div>
            }
            <Modal open={openModal} onClose={handleClose}>
                <Box
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        position: "absolute",
                        width: "400px",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24
                    }}
                >
                    <div>
                        <p>Select the medications you'd like to refill</p>
                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                {items && items.map((item, idx) => (
                                    <FormControlLabel
                                        key={item.medication + idx}
                                        control={
                                            <Checkbox
                                                value={item.medication}
                                                checked={selectedMedications.includes(item.medication)}
                                                onChange={handleCheckboxChange}
                                            />
                                        }
                                        label={item.medication}
                                    />
                                ))}
                            </FormGroup>
                            <div className={style.error}>
                                {error && <p>{error}</p>}
                            </div>
                            <div className={style.button_group}>
                                <button className="default_btn" type="button" onClick={handleClose}>
                                    Cancel
                                </button>
                                <button className="default_btn" type="submit">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </Box>
            </Modal>
        </>
    );
}
