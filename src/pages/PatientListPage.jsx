import {useEffect, useState} from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import {handleError} from "@/utils/handleError.js";
import Layout from "@/components/common/Layout.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import PatientProfileView from "@/components/account/PatientProfileView.jsx";
import UserTable from "@/components/UserTable.jsx";
import {useNavigate} from "react-router-dom";


export default function PatientListPage() {
    const [allPatients, setAllPatients] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");
    const navigate = useNavigate();

    const columns = [
        {field: 'firstName', headerName: 'First Name', flex: 1},
        {field: 'lastName', headerName: 'Last Name', flex: 1},
        {field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1},
        {field: 'gender', headerName: 'Gender', flex: 1},
    ];

    useEffect(() => {
        axios.get("/get-all-patients", {
            params: {token: authToken},
            headers: {"Content-Type": "application/json"}
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
        // eslint-disable-next-line
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

    function handlePrescriptionClick() {
        if (profileData && profileData.id) {
            navigate("/prescription", {state: {patientId: profileData.id}});
        }
    }

    return (
        <>
            <Layout>
                <SearchBar handleSearch={handleSearch}/>
                {profileData ?
                    <>
                        <PatientProfileView profileData={profileData}/>
                        <div className="default_btn_group">
                            <button className="default_btn" onClick={() => setProfileData(null)}>
                                Back
                            </button>
                            <button className="default_btn" onClick={handlePrescriptionClick}>
                                Prescription
                            </button>
                        </div>
                    </> :
                    allPatients.length > 0 &&
                    <UserTable users={allPatients} setProfileData={setProfileData} columns={columns}/>
                }
                {!profileData && errorMessage && <p>{errorMessage}</p>}
            </Layout>
        </>
    );
};