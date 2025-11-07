import AppointmentCard from "@/components/appointment/AppointmentCard.jsx";
import style from "@/styles/appointment.module.css";

export default function AppointmentContainer({title, appointmentList, isScheduled}) {
    const shouldDisplay = appointmentList && appointmentList.length > 0;

    if (!shouldDisplay) return null;

    return (
        <div className={style.appointment_section}>
            <h3>{title}</h3>
            <div className={style.appointment_container}>
                {appointmentList.map((appointment) => (
                    <AppointmentCard appointment={appointment} key={appointment.id} isScheduled={isScheduled} />
                ))}
            </div>
        </div>
    );
}