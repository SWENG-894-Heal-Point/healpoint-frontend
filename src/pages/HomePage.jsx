import secureLocalStorage from "react-secure-storage";
import {parseJwt} from "@/utils/parseJwt.js";
import AdminPortal from "@/pages/AdminPortal.jsx";
import DashboardPage from "@/pages/DashboardPage.jsx";

export default function HomePage() {
    const authToken = secureLocalStorage.getItem("auth-token");
    const role = parseJwt(authToken)?.role?.toLowerCase();

    if (role === "admin" || role === "support_staff") {
        return (<AdminPortal/>);
    } else {
        return (<DashboardPage/>);
    }
}