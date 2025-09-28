import {useState} from "react";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import style from '@/styles/searchbar.module.css';


export default function SearchBar(props) {
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className={style.search_container}>
            <input
                type="text"
                className={style.search_input}
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <span className={style.search_button}>
            <button type="submit" onClick={() => props.handleSearch(searchValue)}><FontAwesomeIcon icon={faMagnifyingGlass}/>
            </button></span>
        </div>
    );
};