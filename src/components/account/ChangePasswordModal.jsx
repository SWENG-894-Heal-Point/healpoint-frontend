import {useState} from "react";
import {Box, Modal} from "@mui/material";
import {ErrorMessage, Field, Form, Formik} from "formik";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import {handleError} from "@/utils/handleError.js";
import style from "@/styles/account.module.css";

export default function ChangePasswordModal({openModal, setOpenModal, isAdminReset = false, targetUserId = null}) {
    const [isShowPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    function checkPassword(str) {
        const re = /^(?=.*\d)(?=.*[!@#$%^*&?])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }

    function handleSave(values) {
        const url = isAdminReset ? "/admin/update-user-password" : "/update-my-password";
        if (isAdminReset && targetUserId) {
            values.targetUserId = targetUserId;
        }

        axios.post(url, values, {
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                setErrorMessage("");
                setOpenModal(false);
            }
        }).catch((err) => {
            handleError(err, setErrorMessage);
        });
    }

    function handleClose() {
        setErrorMessage("");
        setOpenModal(false);
    }

    return (
        <Modal open={openModal} onClose={handleClose}>
            <Box
                sx={{
                    p: 4,
                    borderRadius: 2,
                    position: "absolute",
                    width: "400px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    appearance: "none"
                }}
            >
                <div className={`${style.account_container} ${style.change_password_modal}`}>
                    <div className={style.primary_title}>Change Password</div>
                    <Formik
                        initialValues={{
                            token: authToken,
                            oldPassword: isAdminReset ? "admin-reset" : "",
                            newPassword: "",
                            confirmNewPassword: "",
                        }}
                        validate={(values) => {
                            const errors = {};

                            if (!checkPassword(values.newPassword)) {
                                errors.newPassword =
                                    "Password must be at least 8 characters and include symbol, uppercase, lowercase, number";
                            }

                            if (values.newPassword !== values.confirmNewPassword) {
                                errors.confirmNewPassword = "Passwords do not match";
                            }

                            return errors;
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            setSubmitting(false);
                            handleSave(values);
                        }}
                    >
                        <Form className={style.form}>
                            {!isAdminReset &&
                                <Field
                                    id="oldPassword"
                                    name="oldPassword"
                                    placeholder="Old Password"
                                    type={isShowPassword ? "text" : "password"}
                                    required
                                />}
                            <Field
                                id="newPassword"
                                name="newPassword"
                                placeholder="New Password"
                                type={isShowPassword ? "text" : "password"}
                                required
                            />
                            <span
                                className={style.show_password}
                                onClick={() => setShowPassword(!isShowPassword)}
                            >
                  {isShowPassword ? "Hide" : "Show"}
                </span>
                            <Field
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                placeholder="Confirm New Password"
                                type={isShowPassword ? "text" : "password"}
                                required
                            />
                            <div className={style.error}>
                                <ErrorMessage name="newPassword" component="p"/>
                                <ErrorMessage name="confirmNewPassword" component="p"/>
                                {errorMessage && <p>{errorMessage}</p>}
                            </div>
                            <div className={style.button_group}>
                                <button style={{width: "120px"}} type="button" onClick={handleClose}>
                                    Cancel
                                </button>
                                <button style={{width: "120px"}} type="submit">
                                    Save
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </Box>
        </Modal>
    );
}
