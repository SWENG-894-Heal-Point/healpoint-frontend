import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import './styles/global.css';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import DoctorProfileView from "@/components/account/DoctorProfileView.jsx";
import DoctorDirectoryPage from "@/pages/DoctorDirectoryPage.jsx";
import PatientListPage from "@/pages/PatientListPage.jsx";

function App() {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = secureLocalStorage.getItem("auth-token");
            if (authToken === null && pathname !== "/login" && pathname !== "/signup") {
                navigate("/login");
            }
        }
    }, [navigate, location]);

    return (
        <Routes>
            <Route path="/" element={<DashboardPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/account" element={<AccountPage/>}/>
            <Route path="/doctors" element={<DoctorDirectoryPage/>}/>
            <Route path="/patients" element={<PatientListPage/>}/>
        </Routes>
    );
}

export default App;
