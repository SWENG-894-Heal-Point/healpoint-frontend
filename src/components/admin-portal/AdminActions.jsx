import Dropdown from "@/components/common/Dropdown.jsx";
import style from "@/styles/admin-portal.module.css";
import {useState} from "react";
import ChangePasswordModal from "@/components/account/ChangePasswordModal.jsx";
import AccountDeactivationModal from "@/components/admin-portal/AccountDeactivationModal.jsx";
import ScheduleModal from "@/components/admin-portal/ScheduleModal.jsx";

export default function AdminActions({apiRef, setErrorMessage}) {
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openDeactivationModal, setOpenDeactivationModal] = useState(false);
    const [openScheduleModal, setOpenScheduleModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [accountStatus, setAccountStatus] = useState(null);

    const options = [
        {label: "Account Deactivation", value: "account_deactivation"},
        {label: "Change Password", value: "change_password"},
        {label: "Manage Schedule", value: "manage_schedule"}
    ];

    function handleOnsubmit(e) {
        e.preventDefault();
        setErrorMessage("");
        const formData = new FormData(e.target);
        const action = formData.get("selectaction");

        setSelectedId(null);
        const selectedRows = apiRef.current.getSelectedRows();
        if (selectedRows && selectedRows.size > 0) {
            const selectedData = Array.from(selectedRows.values());
            setSelectedId(selectedData[0].id);
            setAccountStatus(selectedData[0].isActive);
            console.log(action);
            console.log(selectedRows);

            if (action === "change_password") {
                setOpenPasswordModal(true);
            } else if (action === "account_deactivation") {
                setOpenDeactivationModal(true);
            } else if (action === "manage_schedule") {
                if(selectedData[0].role.toLowerCase() === "doctor") {
                    setOpenScheduleModal(true);
                } else {
                    setErrorMessage("Schedule management is only available for users with the 'Doctor' role.");
                }
            }
        } else {
            setErrorMessage("Please select a user to perform the action.");
        }
    }

    return (
        <>
            <ChangePasswordModal openModal={openPasswordModal} setOpenModal={setOpenPasswordModal} isAdminReset={true}
                                 targetUserId={selectedId}/>
            <AccountDeactivationModal openModal={openDeactivationModal} setOpenModal={setOpenDeactivationModal}
                                      selectedId={selectedId} accountStatus={accountStatus}
                                      setAccountStatus={setAccountStatus}/>
            { openScheduleModal &&
                <ScheduleModal openModal={openScheduleModal} setOpenModal={setOpenScheduleModal} doctorId={selectedId}/>}
            <div>
                <form className={style.admin_actions_form} onSubmit={handleOnsubmit}>
                    <Dropdown label="Select Action" options={options} required/>
                    <button className="default_btn" type="submit">
                        Go
                    </button>
                </form>
            </div>
        </>
    );
}