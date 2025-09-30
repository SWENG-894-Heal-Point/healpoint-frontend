import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Sidebar, Menu, MenuItem} from 'react-pro-sidebar';
import secureLocalStorage from "react-secure-storage";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquareCaretLeft, faSquareCaretRight} from "@fortawesome/free-solid-svg-icons";

import LogoutButton from "@/components/account/LogOutButton.jsx";
import {parseJwt} from "@/utils/parseJwt.js";
import style from "@/styles/layout.module.css";
import {getMenuItems} from "@/utils/getMenuItems.js";


export default function Layout(props) {
    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const token = secureLocalStorage.getItem("auth-token");
        if (token) {
            const decoded = parseJwt(token);
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
                        <LogoutButton/>
                    </div>
                </Sidebar>}
                <div className={style.main_content}>{props.children}</div>
            </div>

        </div>
    );
}
