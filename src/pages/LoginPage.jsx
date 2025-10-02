import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Field, Formik} from "formik";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import AccountWrapper from "@/components/account/AccountWrapper";
import style from "@/styles/account.module.css";


const LoginPage = () => {
    const [isShowPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = secureLocalStorage.getItem("auth-token");
            if (authToken !== null) {
                navigate("/");
            }
        }
    }, [navigate]);

    function handleSubmission(values) {
        setErrorMessage("")

        axios.post("/authenticate-user", values, {
            headers: {"Content-Type": "application/json"}
        })
            .then((response) => {
                if (response.status === 200) {
                    secureLocalStorage.setItem("auth-token", response.data);
                    navigate("/");
                }
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    setErrorMessage(err.response.data);
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
                console.error(err);
            });
    }

    return (
        <>
            <Formik initialValues={{
                email: '',
                password: ''
            }} onSubmit={(values, {setSubmitting}) => {
                setTimeout(() => {
                    setSubmitting(false);
                }, 500);

                handleSubmission(values);
            }}>
                <div className={style.login_form}>
                    <AccountWrapper url="/signup" urlText="Create New Account" promptText="">
                        <Field id="email" name="email" placeholder="Email" type="email" required/>
                        <Field id="password" name="password" placeholder="Password"
                               type={isShowPassword ? "text" : "password"} required/>
                        <span className={style.show_password}
                              onClick={() => setShowPassword(!isShowPassword)}>{isShowPassword ? "Hide" : "Show"}</span>
                        {errorMessage && <div className={style.error}>{errorMessage}</div>}
                        <button type="submit">Login</button>
                    </AccountWrapper>
                </div>
            </Formik>
        </>
    );
};

export default LoginPage;
