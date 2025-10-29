import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import style from "@/styles/searchbar.module.css";

export default function SearchBar({handleEmailSearch, handleGenericSearch, enableClear, handleClear}) {
    const [searchValue, setSearchValue] = useState("");
    const emailRegex = /^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;

    function handleSearch(searchValue) {
        const value = typeof searchValue === "object" && searchValue?.target ? searchValue.target.value : searchValue;
        const cleanedValue = String(value).trim();

        if (emailRegex.test(cleanedValue)) {
            handleEmailSearch(cleanedValue);
        } else {
            handleGenericSearch(cleanedValue);
        }
    }

    function onSubmit(e) {
        e.preventDefault(); // prevent page reload
        handleSearch(searchValue);
    }

    function onClear() {
        setSearchValue("");
        handleClear();
    }

    return (
        <div className={style.search_container}>
            <form onSubmit={onSubmit} className={style.search_form}>
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
            {enableClear && <span className={style.clear_button} onClick={onClear}>Clear</span>}
        </div>
    );
}
