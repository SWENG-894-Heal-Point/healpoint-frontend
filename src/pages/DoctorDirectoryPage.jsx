import {useEffect, useState} from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import Layout from "@/components/common/Layout.jsx";
import DoctorProfileView from "@/components/account/DoctorProfileView.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import {handleError} from "@/utils/handleError.js";
import UserTable from "@/components/UserTable.jsx";
import {advancedSearch} from "@/utils/advancedSearch.js";


export default function DoctorDirectoryPage() {
    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
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
        }).then((response) => {
            if (response.status === 200) {
                console.log(response);
                setAllDoctors(response.data);
            }
        }).catch((err) => {
            handleError(err, setErrorMessage)
            setProfileData(null);
        });
    }, []);

    function handleEmailSearch(emailValue) {
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

    function handleGenericSearch(query) {
        const filteredResult = advancedSearch(allDoctors, query);
        if (!filteredResult || filteredResult.length === 0) {
            setErrorMessage("No doctors found matching the search criteria.");
        } else {
            setErrorMessage("");
            setFilteredDoctors(filteredResult);
        }
    }

    return (
        <Layout>
            <SearchBar handleEmailSearch={handleEmailSearch} handleGenericSearch={handleGenericSearch}
                       enableClear={filteredDoctors.length > 0} handleClear={() => setFilteredDoctors([])}/>
            {!profileData && errorMessage && <p>{errorMessage}</p>}
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
                <UserTable users={filteredDoctors.length > 0 ? filteredDoctors : allDoctors}
                           setProfileData={setProfileData} columns={columns}/>
            }
        </Layout>
    );
};