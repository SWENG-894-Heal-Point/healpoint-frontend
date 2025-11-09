import {transformText} from "@/utils/transformText.js";
import style from '@/styles/appointment.module.css';
import {formatDate} from "@/utils/formatDate.js";
import {useState} from "react";
import {Box, Modal} from "@mui/material";
import axios from "axios";
import {handleError} from "@/utils/handleError.js";
import secureLocalStorage from "react-secure-storage";


export default function DoctorAppointmentFooter({appointment, currentDate, isScheduled}) {
    const [openModal, setOpenModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [appointmentStatus, setAppointmentStatus] = useState(null);

    const appointmentDate = formatDate(appointment.appointmentDate);
    const enableUpdate = appointmentDate <= currentDate && isScheduled;
    const patInfo = `${appointment.patient.firstName} ${appointment.patient.lastName}, DOB: ${formatDate(appointment.patient.dateOfBirth, true)}`;

    const authToken = secureLocalStorage.getItem("auth-token");

    const statusOptions = [
        {value: "COMPLETED", label: "Yes"},
        {value: "MISSED", label: "No"}
    ];

    function handleChange(e) {
        setAppointmentStatus(e.target.value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        const payload = {token: authToken, appointmentId: appointment.id, status: appointmentStatus};

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
        <div>
            {enableUpdate ? (
                <div className={style.appointment_actions}>
                    <div onClick={() => setOpenModal(true)}>Update Status</div>
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
                                <div className={style.appointment_modal_prompt}>Did the patient ({patInfo}) attend the
                                    appointment?
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className={style.appointment_update_inputs}>
                                        {statusOptions.map((option, key) => {
                                            return (
                                                <label key={key}>
                                                    <input type="radio" name="status" value={option.value}
                                                           checked={appointmentStatus === option.value}
                                                           onChange={handleChange} required/>
                                                    {option.label}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {
                                        errorMessage &&
                                        <div className={style.error}>
                                            {errorMessage}
                                        </div>
                                    }
                                    <div className={style.button_group}>
                                        <button className="default_btn" type="button"
                                                onClick={() => setOpenModal(false)}>
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
                </div>
            ) : (
                <div>({transformText(appointment.status, "sentence")})</div>
            )}
        </div>
    );
}