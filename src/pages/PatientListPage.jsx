import {useState} from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import {getMenuItems} from "@/utils/getMenuItems.js";
import Layout from "@/components/common/Layout.jsx";
import DoctorProfileView from "@/components/account/DoctorProfileView.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import PatientProfileView from "@/components/account/PatientProfileView.jsx";

export default function PatientListPage() {
    const [profileData, setprofileData] = useState(null);
    const [role] = useState("Doctor");
    const authToken = secureLocalStorage.getItem("auth-token");

    function handleSearch(email) {
        const emailValue = typeof email === "object" && email.target ? email.target.value : email;

        axios.post("/get-doctor-profile", {token: authToken, email: emailValue}, {
            headers: {"Content-Type": "application/json"}
        })
            .then((response) => {
                if (response.status === 200) {
                    setprofileData(response.data);
                    console.log(response.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const menuItems = getMenuItems(role);

    return (
        <>
            <Layout menuItems={menuItems}>
                <SearchBar handleSearch={handleSearch}/>
                {profileData && <PatientProfileView profileData={profileData}/>}
            </Layout>
        </>
    );
};