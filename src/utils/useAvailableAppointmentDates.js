import {useEffect, useState} from "react";
import axios from "axios";
import {handleError} from "@/utils/handleError.js";

export function useAvailableAppointmentDates(authToken) {
    const [availableDates, setAvailableDates] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get("/available-appointment-dates", {
            params: {token: authToken},
            headers: {"Content-Type": "application/json"},
        }).then((response) => {
            if (response.status === 200) {
                setAvailableDates(response.data);
                setErrorMessage("");
            }
        }).catch((err) => handleError(err, setErrorMessage));
    }, [authToken]);

    return {availableDates, errorMessage};
}
