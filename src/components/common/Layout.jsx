import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Menu, MenuItem, Sidebar} from 'react-pro-sidebar';
import {Logout, ViewSidebar} from "@mui/icons-material";
import Icon from '@mui/material/Icon';
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import IconLine from "@/components/appointment/IconLine.jsx";
import {parseJwt} from "@/utils/parseJwt.js";
import {getMenuItems} from "@/utils/getMenuItems.js";
import style from "@/styles/layout.module.css";


export default function Layout(props) {
    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const authToken = secureLocalStorage.getItem("auth-token");
    const tokenExpiry = secureLocalStorage.getItem("auth-token-expiry");
    const currentTime = new Date().getTime();

    const LogoutText = collapsed ? "" : "Log Out";
    const iconStyle = {verticalAlign: 'middle', marginRight: collapsed ? '8px' : '0px'};

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
                if (role.toLowerCase() === "admin" || role.toLowerCase() === "support_staff") {
                    setIsAdmin(true);
                }
            }
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div className={style.layout}>
            {isAdmin ?
                <div className={`${style.header} ${style.admin_portal}`}>
                    <h1>Heal Point Administrator</h1>
                    <button className={style.logout_bnt} onClick={handleLogout}>
                        <IconLine icon={<Logout/>} text="Log out"/>
                    </button>
                </div> :
                <div className={style.header}>
                    <h1>Heal Point</h1>
                </div>
            }
            <div className={style.container}>
                {menuItems.length > 0 &&
                    <Sidebar collapsed={collapsed} className={style.sidebar} backgroundColor="var(--navy-blue-bg-color)"
                             width="220px">
                        <Menu>
                            <MenuItem className={style.collapsed_btn} onClick={() => setCollapsed(!collapsed)}>
                                <ViewSidebar sx={iconStyle}/>
                            </MenuItem>
                            {menuItems.map((item) => (
                                <MenuItem icon={<Icon>{item.icon}</Icon>}
                                          className={location.pathname === item.path ? style.active_tab : ""}
                                          key={item.path} component={<Link to={item.path}/>}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Menu>
                        <div className={style.sidebar_footer}>
                            <button className={style.logout_bnt} onClick={handleLogout}>
                                <IconLine icon={<Logout/>} text={LogoutText}/>
                            </button>
                        </div>
                    </Sidebar>}
                <div className={style.main_content}>{props.children}</div>
            </div>

        </div>
    );
}
