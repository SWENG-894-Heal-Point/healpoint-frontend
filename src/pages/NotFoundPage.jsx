import {useNavigate} from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="not_found_page">
            <h1>404</h1>
            <p>Oops! That page can’t be found.</p>
            <button className="default_btn" onClick={() => navigate("/login")}>Back to homepage</button>
        </div>
    );
}