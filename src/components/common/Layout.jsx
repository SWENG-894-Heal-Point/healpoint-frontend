import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Sidebar, Menu, MenuItem} from 'react-pro-sidebar';
import secureLocalStorage from "react-secure-storage";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquareCaretLeft, faSquareCaretRight} from "@fortawesome/free-solid-svg-icons";

import {parseJwt} from "@/utils/parseJwt.js";
import style from "@/styles/layout.module.css";
import {getMenuItems} from "@/utils/getMenuItems.js";
import axios from "axios";


export default function Layout(props) {
    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState([]);

    const authToken = secureLocalStorage.getItem("auth-token");
    const tokenExpiry = secureLocalStorage.getItem("auth-token-expiry");
    const currentTime = new Date().getTime();

    const navigate = useNavigate();

    function handleLogout() {
        axios.post("/logout-user", {token: authToken}, {
            headers: {"Content-Type": "application/json"}
        }).catch((err) => {
            console.error("Logout failed:", err);
        }).finally(() => {
            secureLocalStorage.removeItem("auth-token");
            secureLocalStorage.removeItem("auth-token-expiry");
            navigate("/login");
        });
    }

    useEffect(() => {
        if (!authToken || !tokenExpiry || currentTime > parseInt(tokenExpiry, 10)) {
            handleLogout();
        } else {
            const decoded = parseJwt(authToken);
            const role = decoded?.role;
            if (role) {
                setMenuItems(getMenuItems(role));
            }
        }
    }, []);

    return (
        <div className={style.layout}>
            <div className={style.header}>
                <h1>Heal Point</h1>
            </div>
            <div className={style.container}>
                {menuItems.length > 0 &&
                    <Sidebar collapsed={collapsed} className={style.sidebar} backgroundColor="var(--navy-blue-bg-color)"
                             width="220px">
                        <Menu>
                            <MenuItem className={style.collapsed_btn} onClick={() => setCollapsed(!collapsed)}>
                                {collapsed ? <FontAwesomeIcon icon={faSquareCaretRight}/> :
                                    <FontAwesomeIcon icon={faSquareCaretLeft}/>}
                            </MenuItem>
                            {menuItems.map((item) => (
                                <MenuItem className={location.pathname === item.path ? style.active_tab : ""}
                                          key={item.path} component={<Link to={item.path}/>}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Menu>
                        <div className={style.sidebar_footer}>
                            <button onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    </Sidebar>}
                <div className={style.main_content}>{props.children}</div>
            </div>

        </div>
    );
}
