import {Formik, Field} from "formik";

import AccountWrapper from "@/components/account/AccountWrapper";
import style from "@/styles/account.module.css";

import states from "@/data/states.json"
import Dropdown from "@/components/common/Dropdown.jsx";
import genderOptions from "@/data/genderOptions.json";

const PersonalInfoSignup = (props) => {
    const currentDate = new Date().toISOString().slice(0, 10);

    return (<Formik
            initialValues={{
                firstName: "",
                lastName: "",
                dateOfBirth: "",
                gender: "",
                phone: "",
                streetAddress: "",
                city: "",
                state: "",
                zipCode: "",
                insuranceProvider: "",
                insuranceId: "",
                medicalDegree: "",
                specialty: "",
                npiNumber: "",
                experience: "",
                languages: "",
            }}
            onSubmit={(values, {setSubmitting}) => {
                setTimeout(() => {
                    setSubmitting(false);
                }, 500);

                props.handleSubmission(values);
            }}
        >
            {({values}) => (<AccountWrapper
                    url="/login"
                    urlText="Log in"
                    promptText="Have an account?&nbsp;"
                >
                    <div className={style.personal_info_container}>
                        <div className={style.left_column}>
                            <Field name="firstName" placeholder="First Name" required/>
                            <Field name="lastName" placeholder="Last Name" required/>
                            <Field
                                name="dateOfBirth"
                                placeholder="Date of Birth (mm/dd/yyyy)"
                                onFocus={(e) => (e.target.type = "date")}
                                type={values.dateOfBirth === "" ? "text" : "date"}
                                min="1920-01-01"
                                max={currentDate}
                                required
                            />
                            <Dropdown label="Gender" options={genderOptions} required/>
                            <Field
                                name="phone"
                                placeholder="Phone No (e.g. 2155551234)"
                                type="tel"
                                pattern="[0-9]{10}"
                                maxLength="10"
                                required
                            />
                        </div>
                        <div className={style.right_column}>
                            {props.isPatient ? (<div>
                                    <Field
                                        name="streetAddress"
                                        placeholder="Street Address"
                                        type="text"
                                        required
                                    />
                                    <Field name="city" placeholder="City" type="text" required/>
                                    <div className={style.info_row}>
                                        <Dropdown className={style.state_field} label="State" required options={states}/>
                                        <Field
                                            name="zipCode"
                                            placeholder="ZIP Code"
                                            type="text"
                                            required
                                        />
                                    </div>
                                    <Field
                                        name="insuranceProvider"
                                        placeholder="Insurance Provider"
                                        type="text"
                                    />
                                    <Field
                                        name="insuranceId"
                                        placeholder="Member ID"
                                        type="text"
                                    />
                                </div>) : (<div>
                                    <Field
                                        name="medicalDegree"
                                        placeholder="Medical Degree"
                                        type="text"
                                        required
                                    />
                                    <Field
                                        name="specialty"
                                        placeholder="Medical Specialty"
                                        type="text"
                                        required
                                    />
                                    <Field
                                        name="npiNumber"
                                        placeholder="NPI Number"
                                        type="number"
                                        min="0"
                                        required
                                    />
                                    <Field
                                        name="experience"
                                        placeholder="Years of Experience"
                                        type="number"
                                        min="0"
                                    />
                                    <Field
                                        name="languages"
                                        placeholder="Languages Spoken"
                                        type="text"
                                    />
                                </div>)}
                        </div>
                    </div>
                    <div className={style.error}>
                        {props.errorMessage && <p>{props.errorMessage}</p>}
                    </div>
                    <button type="submit">Submit</button>
                </AccountWrapper>)}
        </Formik>);
};

export default PersonalInfoSignup;
