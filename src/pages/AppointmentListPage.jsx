import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import orderBy from 'lodash/orderBy';

import AppointmentContainer from "@/components/appointment/AppointmentContainer.jsx";
import Layout from "@/components/common/Layout.jsx";
import Error from "@/components/common/Error.jsx";
import {handleError} from "@/utils/handleError.js";
import {parseJwt} from "@/utils/parseJwt.js";
import style from '@/styles/appointment.module.css';


export default function AppointmentListPage() {
    const [error, setError] = useState("");
    const [appointmentData, setAppointmentData] = useState([]);

    const authToken = secureLocalStorage.getItem("auth-token");
    const role = parseJwt(authToken)?.role?.toLowerCase();
    const navigate = useNavigate();

    const upcomingAppointments = orderBy(appointmentData.filter(a => a.status === "SCHEDULED"),
        ['appointmentDate', 'startTime'], ['asc', 'asc']);
    const pastAppointments = orderBy(appointmentData.filter(a => a.status !== "SCHEDULED"),
        ['appointmentDate', 'startTime'], ['desc', 'desc']);


    useEffect(() => {
        axios.get("/get-my-appointments", {
            params: {token: authToken}, headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data)
                setAppointmentData(response.data);
            }
        }).catch((err) => {
            handleError(err, setError)
            setAppointmentData([]);
        });
        // eslint-disable-next-line
    }, []);

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