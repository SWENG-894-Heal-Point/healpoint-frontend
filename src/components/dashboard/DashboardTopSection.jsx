import {Email, Phone} from "@mui/icons-material";
import AppointmentCard from "@/components/appointment/AppointmentCard.jsx";
import IconLine from "@/components/appointment/IconLine.jsx";

import contact from "@/data/contact.json";
import style from "@/styles/dashboard.module.css";

export default function DashboardTopSection({upcomingAppointments}) {
    const iconStyle = {color: 'var(--navy-blue-bg-color)'};
    const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

    return (
        <div className={style.dashboard_top_section}>
            <div className={style.contact_info}>
                <h3>Need Help?</h3>
                <p>Contact our support team at &mdash;</p>
                <IconLine icon={<Email sx={iconStyle}/>} text={contact.email}/>
                <IconLine icon={<Phone sx={iconStyle}/>} text={contact.phone}/>
            </div>
            {
                nextAppointment &&
                <div>
                    <h3>Next Appointment</h3>
                    <AppointmentCard appointment={nextAppointment} isScheduled={true}/>
                </div>
            }
        </div>
    );
}