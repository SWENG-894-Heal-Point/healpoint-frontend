import {useState} from "react";
import {Box, Modal} from "@mui/material";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import {formatDate} from "@/utils/formatDate.js";
import {formatTime} from "@/utils/formatTime.js";
import {handleError} from "@/utils/handleError.js";
import style from "@/styles/appointment.module.css";


export default function CancelAppointmentModal({appointment}) {
    const [openModal, setOpenModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const formatedDate = formatDate(appointment.appointmentDate, true);
    const formatedTime = formatTime(appointment.startTime);
    const authToken = secureLocalStorage.getItem("auth-token");

    function handleConfirmCancel() {
        const payload = {token: authToken, appointmentId: appointment.id, status: "CANCELED"};

        axios.post("/update-appointment", payload, {
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                setErrorMessage("");
                setOpenModal(false);
                window.location.reload();
            }
        }).catch((err) => {
            handleError(err, setErrorMessage)
        })
    }

    return (
        <>
            <div onClick={() => setOpenModal(true)}>Cancel</div>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        position: "absolute",
                        width: "300px",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24
                    }}
                >
                    <div>
                        <div className={style.appointment_modal_prompt}>
                            You're about to cancel your appointment with
                            Dr. {appointment.doctor.lastName} ({formatedDate} at {formatedTime}). Continue?
                        </div>
                        <div className={style.error}>
                            {errorMessage && <p>{errorMessage}</p>}
                        </div>
                        <div className={style.button_group}>
                            <button className="default_btn" type="button" onClick={() => setOpenModal(false)}>
                                No
                            </button>
                            <button className="default_btn" type="button" onClick={handleConfirmCancel}>
                                Yes
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}