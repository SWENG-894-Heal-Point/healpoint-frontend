import {useNavigate} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

export default function LogoutButton() {
    const navigate = useNavigate();

    async function handleLogout() {
        const authToken = secureLocalStorage.getItem("auth-token");
        secureLocalStorage.removeItem("auth-token");

        try {
            await axios.post("/logout-user", {token: authToken}, {
                headers: {"Content-Type": "application/json"}
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            navigate("/login");
        }
    }

    return (
        <button onClick={handleLogout}>
            Log Out
        </button>
    );
};