import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!show) {
        return null;
    }

    return (
        <div className="not_found_page">
            <h1>404</h1>
            <p>Oops! That page can’t be found.</p>
            <button className="default_btn" onClick={() => navigate("/login")}>Back to homepage</button>
        </div>
    );
}