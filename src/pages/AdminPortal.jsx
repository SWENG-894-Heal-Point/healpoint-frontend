import {useGridApiRef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import secureLocalStorage from "react-secure-storage";
import {noop} from "lodash/util.js";

import Layout from "@/components/common/Layout.jsx";
import AllRolesUserTable from "@/components/admin-portal/AllRolesUserTable.jsx";
import AdminActions from "@/components/admin-portal/AdminActions.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import Error from "@/components/common/Error.jsx";
import {fetchUserList} from "@/utils/fetchUserList.js";
import {advancedSearch} from "@/utils/advancedSearch.js";
import style from "@/styles/admin-portal.module.css";

export default function AdminPortal() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const authToken = secureLocalStorage.getItem("auth-token");
    const apiRef = useGridApiRef();



    useEffect(() => {
        fetchUserList("/admin/get-all-users", authToken, setAllUsers, setErrorMessage, noop);
        // eslint-disable-next-line
    }, []);

    function handleGenericSearch(query) {
        const filteredResult = advancedSearch(allUsers, query);

        if (!filteredResult || filteredResult.length === 0) {
            setErrorMessage("No user was found that matches the search criteria.");
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        } else {
            setErrorMessage("");
            setFilteredUsers(filteredResult);
        }
    }

    return (
        <Layout>
            <div className={style.admin_portal}>
                <div className={style.toolbar}>
                    <SearchBar handleEmailSearch={noop} skipEmailSearch={true} handleGenericSearch={handleGenericSearch}
                               enableClear={filteredUsers.length > 0} handleClear={() => setFilteredUsers([])}/>
                    <AdminActions apiRef={apiRef} setErrorMessage={setErrorMessage}/>
                </div>
                <Error message={errorMessage}/>
                {allUsers.length > 0 &&
                    <AllRolesUserTable users={filteredUsers.length > 0 ? filteredUsers : allUsers} apiRef={apiRef}/>}
            </div>
        </Layout>
    );
}