import {useEffect, useState} from "react";
import secureLocalStorage from "react-secure-storage";

import DashboardTopSection from "@/components/dashboard/DashboardTopSection.jsx";
import Layout from "@/components/common/Layout.jsx";
import {useAppointmentList} from "@/utils/useAppointmentList.js";
import axios from "axios";
import {handleError} from "@/utils/handleError.js";
import NotificationTable from "@/components/dashboard/NotificationTable.jsx";

export default function DashboardPage() {
    const [notificationData, setNotificationData] = useState([]);
    const [_error, setError] = useState("");
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
            <DashboardTopSection upcomingAppointments={upcomingAppointments}/>
            <NotificationTable notificationData={notificationData}/>
        </Layout>
    );
};