import {createContext, useState} from "react";
import {loadingHandler} from "@/components/loading/loadingHandler.js";

const LoadingContext = createContext({
    loading: false,
    setLoading: () => {
    }
});

export default function LoadingProvider({children}) {
    const [loading, setLoading] = useState(false);

    loadingHandler.register(setLoading);

    return (
        <LoadingContext.Provider value={{loading, setLoading}}>
            {children}
        </LoadingContext.Provider>
    );
}

export {LoadingContext};