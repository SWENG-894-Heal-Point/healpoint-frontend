import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Formik, Field, ErrorMessage} from "formik";

import AccountWrapper from "@/components/account/AccountWrapper";
import PersonalInfoSignup from "@/components/account/PersonalInfoSignup";
import style from "@/styles/account.module.css";

const SignupPage = () => {
    const [isPasswordMatch, setPasswordsMatch] = useState(false);
    const [isShowPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isContinue, setContinue] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isPatient, setIsPatient] = useState(true);

    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // const csrftoken = GetCSFR();

    /**
     * Checks if the password is valid and has min 8 letter password, at least 1 symbol, upper and
     * lowercase letters and number.
     *
     * @param str - the password to be validated.
     * @returns a boolean indicating whether the password is valid.
     */
    function checkPassword(str) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }

    /**
     * Handles the submission of the personal info form.
     *
     * @param values - the values from the personal info form.
     */
    function handleContinue(values) {
        setErrorMessage("");
        if (values.password !== values.confirmPassword) {
            return;
        }

        axios.get("/user-existence", {params: {email: values.email}})
            .then((response) => {
                if (response.data === false) {
                    setIsPatient(values.role === "patient");
                    setUserInfo(values);
                    setContinue(true);
                } else {
                    setErrorMessage("An account with this email already exists");
                }
            })
            .catch((err) => {
                console.log(err);
                setErrorMessage(err.response.data);
            });
    }

    function handleSubmission(values) {
        setErrorMessage("");
        const payload = {...userInfo, ...values};

        axios.post("/register-user", JSON.stringify(payload), {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Account created successfully! Please log in.");
                    navigate("/login");
                }
            })
            .catch((err) => {
                console.log(err);
                setErrorMessage(err.response.data);
            });
    }

    return (
        <div className="signup_page">
            {isContinue ?
                <PersonalInfoSignup isPatient={isPatient} handleSubmission={handleSubmission} errorMessage={errorMessage} />
                :
                <Formik
                    initialValues={{
                        role: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validate={(values) => {
                        const errors = {};

                        if (!checkPassword(values.password)) {
                            errors.password = "Your password must be at least 8 characters long and include a symbol, uppercase letter, lowercase letter, and number";
                        }

                        return errors;
                    }}

                    onSubmit={(
                        values,
                        {setSubmitting}
                    ) => {
                        setTimeout(() => {
                            setSubmitting(false);
                        }, 500);

                        handleContinue(values);
                    }}>
                    {({values, handleChange}) => (
                        <AccountWrapper url="/login" urlText="Log in" propmtText="Have an account?&nbsp;">
                            <Field id="email" name="email" placeholder="Email" type="email" required/>
                            <Field id="password" name="password" placeholder="Password"
                                   type={isShowPassword ? "text" : "password"} required
                                   onChange={(e) => {
                                       handleChange(e);
                                       setPasswordsMatch(e.target.value === values.confirmPassword);
                                   }}
                            />
                            <span id={style.show_password}
                                  onClick={() => setShowPassword(!isShowPassword)}>{isShowPassword ? "Hide" : "Show"}</span>
                            <Field id="confirmPassword" name="confirmPassword" placeholder="Confirm Password"
                                   type={isShowPassword ? "text" : "password"} required onChange={(e) => {
                                handleChange(e);
                                setPasswordsMatch(e.target.value === values.password);
                            }}
                            />
                            <div className={style.radio_input}>
                                <label className={style.radio_label}>Are you a patient or doctor?</label>
                                <div className={style.radio_btn}>
                                    {["Patient", "Doctor"].map((e, key) => {
                                        return (
                                            <label key={key}>
                                                <Field type="radio" name="role" value={e.toLowerCase()} required/>
                                                {e}</label>
                                        );
                                    })}
                                </div>
                            </div>
                            {(values.password.length > 0 || values.confirmPassword.length > 0) &&
                                <div className={style.error}>
                                    <ErrorMessage name="password" component="p"/>
                                    {errorMessage && <p>{errorMessage}</p>}
                                    {values.password.length > 0 && values.confirmPassword.length > 0 && !isPasswordMatch &&
                                        <p>Passwords do not match</p>}
                                </div>
                            }
                            <button type="submit">Continue</button>
                        </AccountWrapper>
                    )}
                </Formik>}
        </div>
    );
};

export default SignupPage;
