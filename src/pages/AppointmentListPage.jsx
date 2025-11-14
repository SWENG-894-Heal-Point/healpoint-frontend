import {useState} from "react";
import {useNavigate} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import AppointmentContainer from "@/components/appointment/AppointmentContainer.jsx";
import Layout from "@/components/common/Layout.jsx";
import Error from "@/components/common/Error.jsx";
import {useAppointmentList} from "@/utils/useAppointmentList.js";
import {parseJwt} from "@/utils/parseJwt.js";
import style from '@/styles/appointment.module.css';


export default function AppointmentListPage() {
    const [error, setError] = useState("");

    const authToken = secureLocalStorage.getItem("auth-token");
    const role = parseJwt(authToken)?.role?.toLowerCase();
    const navigate = useNavigate();

    const {appointmentData, upcomingAppointments, pastAppointments} = useAppointmentList(authToken, setError);

    return (
        <>
            <Layout>
                {role.toLowerCase() === "patient" &&
                    <div className={style.single_btn_section}>
                        <button className="default_btn" onClick={() => navigate("/schedule-appointment")}>
                            New Appointment
                        </button>
                    </div>}
                <Error message={error}/>
                {
                    appointmentData.length === 0 && !error &&
                    <div className={style.empty_appointment_list}>
                        You have no past or upcoming appointments.
                    </div>
                }
                <AppointmentContainer appointmentList={upcomingAppointments} title="Upcoming Appointments"
                                      isScheduled={true}/>
                <AppointmentContainer appointmentList={pastAppointments} title="Past Appointments" isScheduled={false}/>
            </Layout>
        </>
    );
};