import {useEffect, useState} from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import Layout from "@/components/common/Layout.jsx";
import DoctorProfileView from "@/components/account/DoctorProfileView.jsx";
import PatientProfileView from "@/components/account/PatientProfileView.jsx";

import style from '@/styles/profile.module.css';


export default function AccountPage() {
    const [profileData, setProfileData] = useState(null);
    const [role, setRole] = useState("Patient");
    const authToken = secureLocalStorage.getItem("auth-token");

    useEffect(() => {
        axios.post("/get-my-profile", {token: authToken}, {
            headers: {"Content-Type": "application/json"}
        })
            .then((response) => {
                if (response.status === 200) {
                    setRole(response.data.role);
                    setProfileData(response.data);
                    console.log(response.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
        // eslint-disable-next-line
    }, []);


    return (
        <>
            <Layout>
                {role === "Doctor" && profileData && <DoctorProfileView profileData={profileData} />}
                {role === "Patient" && profileData && <PatientProfileView profileData={profileData} />}
                {profileData && <div className={style.button_group}>
                    <button className="default_btn">Edit</button>
                    <button className="default_btn">Change Password</button>
                </div>}
            </Layout>
        </>
    );
};