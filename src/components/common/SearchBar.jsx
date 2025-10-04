import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import style from "@/styles/searchbar.module.css";

export default function SearchBar({handleSearch}) {
    const [searchValue, setSearchValue] = useState("");

    function onSubmit(e) {
        e.preventDefault(); // prevent page reload
        handleSearch(searchValue);
    }

    return (
        <form onSubmit={onSubmit} className={style.search_container}>
            <input
                type="text"
                className={style.search_input}
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit" className={style.search_button}>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </button>
        </form>
    );
}
