import {useNavigate} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const LogoutButton = () => {
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
        <button className="default_btn" onClick={handleLogout}>
            Log Out
        </button>
    );
};

export default LogoutButton;
