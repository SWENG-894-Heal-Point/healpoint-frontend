import axios from "axios";

export function fetchProfileData(token, setRole, setProfileData) {
    axios.post("/get-my-profile", {token: token}, {
        headers: {"Content-Type": "application/json"}
    })
        .then((response) => {
            if (response.status === 200) {
                setRole(response.data.role);
                setProfileData(response.data);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}
