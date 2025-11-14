import {useEffect, useState} from "react";
import axios from "axios";
import orderBy from 'lodash/orderBy';
import {handleError} from "@/utils/handleError.js";


export function useAppointmentList(authToken, setError) {
    const [appointmentData, setAppointmentData] = useState([]);

    useEffect(() => {
        axios.get("/get-my-appointments", {
            params: {token: authToken}, headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                setAppointmentData(response.data);
            }
        }).catch((err) => {
            handleError(err, setError)
            setAppointmentData([]);
        });
        // eslint-disable-next-line
    }, []);

    const upcomingAppointments = orderBy(appointmentData.filter(a => a.status === "SCHEDULED"),
        ['appointmentDate', 'startTime'], ['asc', 'asc']);
    const pastAppointments = orderBy(appointmentData.filter(a => a.status !== "SCHEDULED"),
        ['appointmentDate', 'startTime'], ['desc', 'desc']);

    return {appointmentData, upcomingAppointments, pastAppointments};
}