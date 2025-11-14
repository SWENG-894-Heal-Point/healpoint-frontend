import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import Layout from "@/components/common/Layout.jsx";
import DoctorProfileView from "@/components/account/DoctorProfileView.jsx";
import PatientProfileView from "@/components/account/PatientProfileView.jsx";
import {fetchProfileData} from "@/utils/fetchProfileData.js";

import style from '@/styles/profile.module.css';
import ChangePasswordModal from "../components/account/ChangePasswordModal.jsx";


export default function AccountPage() {
    const [openModal, setOpenModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [role, setRole] = useState("patient");
    const authToken = secureLocalStorage.getItem("auth-token");

    useEffect(() => {
        if (authToken) {
            fetchProfileData(authToken, setRole, setProfileData);
        }
    }, [authToken]);


    return (
        <>
            <Layout>
                {role.toLowerCase() === "doctor" && profileData && <DoctorProfileView profileData={profileData}/>}
                {role.toLowerCase() === "patient" && profileData && <PatientProfileView profileData={profileData}/>}
                {profileData && <div className={style.button_group}>
                    <Link to="/update-account">
                        <button className="default_btn">Edit</button>
                    </Link>
                    <button onClick={() => setOpenModal(true)} className="default_btn">Change Password</button>
                </div>}
                <ChangePasswordModal openModal={openModal} setOpenModal={setOpenModal} />
            </Layout>
        </>
    );
};