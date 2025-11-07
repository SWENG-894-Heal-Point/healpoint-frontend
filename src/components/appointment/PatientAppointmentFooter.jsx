import {formatDate} from "@/utils/formatDate.js";
import {transformText} from "@/utils/transformText.js";
import style from '@/styles/appointment.module.css';


export default function PatientAppointmentFooter({appointment, currentDate}) {
    const appointmentDate = formatDate(appointment.appointmentDate);
    const isFutureAppointment = appointmentDate > currentDate;

    function handleReschedule() {
        console.log("Reschedule appointment:", appointment.id);
    }

    function handleCancel() {
        console.log("Cancel appointment:", appointment.id);
    }

    return (
        <div>
            {isFutureAppointment ? (
                <div className={style.appointment_actions}>
                    <div onClick={handleReschedule}>Reschedule</div>
                    <div onClick={handleCancel}>Cancel</div>
                </div>
            ) : (
                <div>({transformText(appointment.status, "sentence")})</div>
            )}
        </div>
    );
}