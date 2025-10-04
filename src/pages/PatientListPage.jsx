import {useEffect, useState} from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import {handleError} from "@/utils/handleError.js";
import Layout from "@/components/common/Layout.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import PatientProfileView from "@/components/account/PatientProfileView.jsx";
import UserTable from "@/components/UserTable.jsx";


export default function PatientListPage() {
    const [allPatients, setAllPatients] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    useEffect(() => {
        axios.get("/get-all-patients", {
            params: { token: authToken },
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    setAllPatients(response.data);
                }
            })
            .catch((err) => {
                handleError(err, setErrorMessage)
                setProfileData(null);
            });
    }, []);


    function handleSearch(email) {
        const emailValue = typeof email === "object" && email.target ? email.target.value : email;

        axios.post("/get-patient-profile", {token: authToken, email: emailValue}, {
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
        <>
            <Layout>
                <SearchBar handleSearch={handleSearch}/>
                {profileData ?
                    <>
                        <PatientProfileView profileData={profileData}/>
                        <button className="default_btn profile_back_btn" onClick={() => setProfileData(null)}>
                            Back
                        </button>
                    </>:
                    allPatients.length > 0 && <UserTable users={allPatients} setProfileData={setProfileData} />
                }
                {!profileData && errorMessage && <p>{errorMessage}</p>}
            </Layout>
        </>
    );
};