import CircularProgress from '@mui/material/CircularProgress';
import {useContext} from "react";

import {LoadingContext} from "@/components/loading/LoadingContext.jsx";


export default function LoadingOverlay() {
    const {loading, _setLoading} = useContext(LoadingContext);
    if (!loading) return null;

    return (
        <div className="loading-overlay">
            <CircularProgress sx={{color: '#bd269b'}}/>
        </div>
    );
}