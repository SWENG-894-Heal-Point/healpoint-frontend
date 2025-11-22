import {useState} from "react";
import {Box, Modal} from "@mui/material";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import {handleError} from "@/utils/handleError.js";
import accountStyle from "@/styles/account.module.css";
import style from "@/styles/admin-portal.module.css";

export default function AccountDeactivationModal({openModal, setOpenModal, selectedId, accountStatus, setAccountStatus}) {
    const [errorMessage, setErrorMessage] = useState("");
    const authToken = secureLocalStorage.getItem("auth-token");

    const statusOptions = [
        {value: true, label: "Active"},
        {value: false, label: "Inactive"}
    ];

    function handleChange(e) {
        const value = e.target.value === "true";
        setAccountStatus(value);
    }

    function handleClose() {
        setErrorMessage("");
        setOpenModal(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const payload = {token: authToken, targetUserId: selectedId, isActive: accountStatus};

        axios.post("/admin/account-status", payload, {
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                setErrorMessage("");
                setOpenModal(false);
                window.location.reload();
            }
        }).catch((err) => {
            handleError(err, setErrorMessage);
        });
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
                <div className={accountStyle.account_container}>
                    <div className={accountStyle.primary_title}>Account Deactivation</div>
                    <div className={style.modal_prompt}> You’re about to update the account status for
                        user {selectedId}.
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={style.account_deactivation_inputs}>
                            {statusOptions.map((option, key) => {
                                return (
                                    <label key={key}>
                                        <input type="radio" name="status" value={option.value}
                                               checked={accountStatus === option.value}
                                               onChange={handleChange} required/>
                                        {option.label}
                                    </label>
                                );
                            })}
                        </div>
                        {
                            errorMessage &&
                            <div className={accountStyle.error}>
                                {errorMessage}
                            </div>
                        }
                        <div className={style.button_group}>
                            <button className="default_btn" type="button" onClick={handleClose}>
                                Cancel
                            </button>
                            <button className="default_btn" type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
}