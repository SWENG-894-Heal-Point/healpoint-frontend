import secureLocalStorage from "react-secure-storage";
import {Event, Person, Schedule} from "@mui/icons-material";

import PatientAppointmentFooter from "@/components/appointment/PatientAppointmentFooter.jsx";
import DoctorAppointmentFooter from "@/components/appointment/DoctorAppointmentFooter.jsx";
import {formatDate} from "@/utils/formatDate.js";
import {formatTime} from "@/utils/formatTime.js";
import {parseJwt} from "@/utils/parseJwt.js";
import style from '@/styles/appointment.module.css';

export default function AppointmentCard({appointment, isScheduled}) {
    const authToken = secureLocalStorage.getItem("auth-token");
    const role = parseJwt(authToken)?.role?.toLowerCase();
    const name = role === "doctor" ?
        `${appointment.patient.firstName} ${appointment.patient.lastName}` :
        `${appointment.doctor.firstName} ${appointment.doctor.lastName}, ${appointment.doctor.medicalDegree}`;

    const appointmentTime = `${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`;

    const iconStyle = {color: 'var(--navy-blue-bg-color)'};
    const currentDate = new Date(2025, 11, 22);

    return (
        <div className={style.appointment_card}>
            <div className={style.card_title}>{appointment.reason}</div>
            <div className={style.icon_line}><Person sx={iconStyle}/> {name}</div>
            <div className={style.icon_line}><Event sx={iconStyle}/> {formatDate(appointment.appointmentDate, true)}
            </div>
            <div className={style.icon_line}><Schedule sx={iconStyle}/> {appointmentTime}</div>
            {
                role === "patient" ?
                    <PatientAppointmentFooter appointment={appointment} currentDate={currentDate}/> :
                    <DoctorAppointmentFooter appointment={appointment} currentDate={currentDate} isScheduled={isScheduled}/>
            }
        </div>
    );
}
