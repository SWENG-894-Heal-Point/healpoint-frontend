import {transformText} from "@/utils/transformText.js";
import style from '@/styles/appointment.module.css';
import {formatDate} from "@/utils/formatDate.js";


export default function DoctorAppointmentFooter({appointment, currentDate, isScheduled}) {
    const appointmentDate = formatDate(appointment.appointmentDate);
    const enableUpdate = appointmentDate <= currentDate && isScheduled;

    function handleUpdateStatus() {
        console.log("Update appointment's status:", appointment.id);
    }

    return (
        <div>
            {enableUpdate ? (
                <div className={style.appointment_actions}>
                    <div onClick={handleUpdateStatus}>Update Status</div>
                </div>
            ) : (
                <div>({transformText(appointment.status, "sentence")})</div>
            )}
        </div>
    );
}