import {useEffect, useState} from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import Layout from "@/components/common/Layout.jsx";
import DoctorProfileView from "@/components/account/DoctorProfileView.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import {handleError} from "@/utils/handleError.js";
import UserTable from "@/components/UserTable.jsx";


export default function DoctorDirectoryPage() {
    const [allDoctors, setAllDoctors] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    const columns = [
        {field: 'firstName', headerName: 'First Name', flex: 1},
        {field: 'lastName', headerName: 'Last Name', flex: 1},
        {field: 'medicalDegree', headerName: 'Degree', flex: 1},
        {field: 'specialty', headerName: 'Specialty', flex: 1},
        {field: 'gender', headerName: 'Gender', flex: 1},
    ];

    useEffect(() => {
        axios.get("/get-all-doctors", {
            headers: {"Content-Type": "application/json"}
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    setAllDoctors(response.data);
                }
            })
            .catch((err) => {
                handleError(err, setErrorMessage)
                setProfileData(null);
            });
        // eslint-disable-next-line
    }, []);

    function handleSearch(email) {
        const emailValue = typeof email === "object" && email.target ? email.target.value : email;

        axios.post("get-doctor-profile", {token: authToken, email: emailValue}, {
            headers: {"Content-Type": "application/json"}
        })
            .then((response) => {
                if (response.status === 200) {
                    setProfileData(response.data);
                }
            })
            .catch((err) => {
                handleError(err, setErrorMessage)
                setProfileData(null);
            });
    }

    return (
        <Layout>
            <SearchBar handleSearch={handleSearch}/>
            {profileData ?
                <>
                    <DoctorProfileView profileData={profileData}/>
                    <div className="default_btn_group">
                        <button className="default_btn" onClick={() => setProfileData(null)}>
                            Back
                        </button>
                    </div>
                </>
                :
                allDoctors.length > 0 &&
                <UserTable users={allDoctors} setProfileData={setProfileData} columns={columns}/>
            }
            {!profileData && errorMessage && <p>{errorMessage}</p>}
        </Layout>
    );
};