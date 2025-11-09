import {useNavigate} from "react-router-dom";

import CancelAppointmentModal from "@/components/appointment/CancelAppointmentModal.jsx";
import {formatDate} from "@/utils/formatDate.js";
import {transformText} from "@/utils/transformText.js";
import style from '@/styles/appointment.module.css';


export default function PatientAppointmentFooter({appointment, currentDate}) {
    const appointmentDate = formatDate(appointment.appointmentDate);
    const isFutureAppointment = appointmentDate > currentDate;
    const navigate = useNavigate();

    function handleReschedule() {
        if (appointment) {
            navigate("/reschedule-appointment", {state: {appointment: appointment}});
        }
    }

    return (
        <>
            <div>
                {isFutureAppointment && appointment.status === "SCHEDULED" ? (
                    <div className={style.appointment_actions}>
                        <div onClick={handleReschedule}>Reschedule</div>
                        <CancelAppointmentModal appointment={appointment}/>
                    </div>
                ) : (
                    <div>({transformText(appointment.status, "sentence")})</div>
                )}
            </div>
        </>
    );
}