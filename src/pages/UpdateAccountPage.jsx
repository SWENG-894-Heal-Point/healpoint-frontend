import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Field, Form, Formik} from "formik";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import Layout from "@/components/common/Layout.jsx";
import Dropdown from "@/components/common/Dropdown.jsx";
import {fetchProfileData} from "@/utils/fetchProfileData.js";
import genderOptions from "@/data/genderOptions.json";
import states from "@/data/states.json";

import style from "@/styles/account.module.css"
import {handleError} from "@/utils/handleError.js";


export default function UpdateAccountPage() {
    const [profileData, setProfileData] = useState(null);
    const [role, setRole] = useState("patient");
    const [errorMessage, setErrorMessage] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            fetchProfileData(authToken, setRole, setProfileData);
        }
    }, [authToken]);

    function handleProfileUpdate(values) {
        axios.post("/update-my-profile", values, {
            headers: {"Content-Type": "application/json"}
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate("/account");
                }
            })
            .catch((err) => {
                handleError(err, setErrorMessage);
            });
    }

    return (
        <Layout>
            {!profileData ?
                <div>Loading...</div> :
                <Formik initialValues={{
                    token: authToken,
                    role: role,
                    gender: profileData?.gender || '',
                    email: profileData?.email || '',
                    phone: profileData?.phone || '',
                    streetAddress: profileData?.streetAddress || '',
                    city: profileData?.city || '',
                    state: profileData?.state || '',
                    zipCode: profileData?.zipCode || '',
                    insuranceProvider: profileData?.insuranceProvider || '',
                    insuranceId: profileData?.insuranceId || '',
                    medicalDegree: profileData?.medicalDegree || '',
                    specialty: profileData?.specialty || '',
                    npiNumber: profileData?.npiNumber || '',
                    experience: profileData?.experience || '',
                    languages: profileData?.languages || ''
                }}
                        onSubmit={(values, {setSubmitting}) => {
                            setTimeout(() => {
                                setSubmitting(false);
                            }, 500);

                            handleProfileUpdate(values);
                        }}>
                    <Form>
                        <h2 className="text-align-center">Update Details</h2>
                        <div className={style.update_profile_container}>
                            <div className={style.left_column}>
                                <Dropdown label="Gender" options={genderOptions} required/>
                                <Field name="phone" placeholder="Phone No (e.g. 2155551234)" type="tel"
                                       pattern="[0-9]{10}" maxLength="10" required/>
                                <Field id="email" name="email" placeholder="Email" type="email" required/>
                                {role.toLowerCase() === "patient" ?
                                    <Field name="insuranceProvider" placeholder="Insurance Provider" type="text"/> :
                                    <Field name="languages" placeholder="Languages Spoken" type="text"/>}
                            </div>
                            <div className={style.right_column}>
                                {role.toLowerCase() === "patient" ?
                                    <>
                                        <Field name="streetAddress" placeholder="Street Address" type="text" required/>
                                        <Field name="city" placeholder="City" type="text" required/>
                                        <div className={style.info_row}>
                                            <Dropdown className={style.state_field} label="State" options={states}
                                                      required/>
                                            <Field name="zipCode" placeholder="ZIP Code" type="text" required/>
                                        </div>
                                        <Field name="insuranceId" placeholder="Member ID" type="text"/>
                                    </> : <>
                                        <Field name="medicalDegree" placeholder="Medical Degree" type="text" required/>
                                        <Field name="specialty" placeholder="Medical Specialty" type="text" required/>
                                        <Field name="npiNumber" placeholder="NPI Number" type="number" min="0"
                                               required/>
                                        <Field name="experience" placeholder="Years of Experience" type="number"
                                               min="0"/>
                                    </>
                                }
                            </div>
                        </div>
                        <p className="text-align-center">To update your name or date of birth, please contact the
                            reception desk.</p>
                        <div className={style.error}>
                            {errorMessage && <p>{errorMessage}</p>}
                        </div>
                        <div className={style.button_group}>
                            <Link to="/account">
                                <button className="default_btn">Cancel</button>
                            </Link>
                            <button className="default_btn" type="submit">Save</button>
                        </div>
                    </Form>
                </Formik>}
        </Layout>
    );
};