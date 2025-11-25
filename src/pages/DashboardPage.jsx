import {useEffect, useState} from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import Layout from "@/components/common/Layout.jsx";
import DashboardWidget from "@/components/dashboard/DashboardWidget.jsx";
import NotificationTable from "@/components/dashboard/NotificationTable.jsx";
import {useAppointmentList} from "@/utils/useAppointmentList.js";
import {handleError} from "@/utils/handleError.js";
import style from "@/styles/dashboard.module.css";
import Error from "@/components/common/Error.jsx";


export default function DashboardPage() {
    const [notificationData, setNotificationData] = useState([]);
    const [error, setError] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    const {_appointmentData, upcomingAppointments, _pastAppointments} = useAppointmentList(authToken, setError);

    useEffect(() => {
        axios.get("/get-my-notifications", {
            params: {token: authToken}, headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                setNotificationData(response.data);
            }
        }).catch((err) => {
            handleError(err, setError)
            setNotificationData([]);
        });
        // eslint-disable-next-line
    }, []);


    return (
        <Layout>
            <div className={style.dashboard}>
                <Error message={error}/>
                {
                    notificationData.length === 0 && !error &&
                    <div className={style.empty_notification_table}>
                        There are no notifications right now.
                    </div>
                }
                <NotificationTable notificationData={notificationData}/>
                <DashboardWidget upcomingAppointments={upcomingAppointments}/>
            </div>
        </Layout>
    );
};