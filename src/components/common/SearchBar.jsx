import {useState} from "react";
import {Search} from "@mui/icons-material";
import style from "@/styles/searchbar.module.css";

export default function SearchBar({handleEmailSearch, handleGenericSearch, enableClear, handleClear}) {
    const [searchValue, setSearchValue] = useState("");
    const emailRegex = /^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;

    const iconStyle = {verticalAlign: 'middle', width: 28, height: 28, };

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
        e.preventDefault();
        if (searchValue.trim() !== "") {
            handleSearch(searchValue);
        }
    }

    function onClear() {
        setSearchValue("");
        handleClear();
    }

    return (
        <div className={style.search_container}>
            <form onSubmit={onSubmit} className={style.search_form}>
                <button type="submit" className={style.search_button}>
                    <Search sx={iconStyle}/>
                </button>
                <input
                    type="text"
                    className={style.search_input}
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </form>
            {enableClear && <span className={style.clear_button} onClick={onClear}>Clear</span>}
        </div>
    );
}
