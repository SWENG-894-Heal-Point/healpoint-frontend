import {useState} from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import {getMenuItems} from "@/utils/getMenuItems.js";
import Layout from "@/components/common/Layout.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import PatientProfileView from "@/components/account/PatientProfileView.jsx";


export default function PatientListPage() {
    const [profileData, setProfileData] = useState(null);
    const [role] = useState("Doctor");
    const [message, setMessage] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    function handleSearch(email) {
        const emailValue = typeof email === "object" && email.target ? email.target.value : email;

        axios.post("/get-patient-profile", {token: authToken, email: emailValue}, {
            headers: {"Content-Type": "application/json"}
        })
            .then((response) => {
                if (response.status === 200) {
                    setProfileData(response.data);
                    console.log(response.data);
                }
            })
            .catch((err) => {
                if (err.response) {
                    setMessage(err.response.data);
                    setProfileData(null);
                }
                console.error(err);
            });
    }

    const menuItems = getMenuItems(role);

    return (
        <>
            <Layout menuItems={menuItems}>
                <SearchBar handleSearch={handleSearch}/>
                {profileData && <PatientProfileView profileData={profileData}/>}
                {!profileData && message && <p>{message}</p>}
            </Layout>
        </>
    );
};