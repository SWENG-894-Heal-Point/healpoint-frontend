import axios from "axios";
import {handleError} from "@/utils/handleError.js";

export function fetchUserList(endpoint, token, setData, setError, setProfileData) {
    axios.get(endpoint, {
        params: {token: token},
        headers: {"Content-Type": "application/json"}
    }).then((response) => {
        if (response.status === 200) {
            setData(response.data);
        }
    }).catch((err) => {
        handleError(err, setError)
        setProfileData(null);
    });
}
