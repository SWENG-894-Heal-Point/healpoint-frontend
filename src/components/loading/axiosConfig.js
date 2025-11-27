import axios from "axios";
import { loadingHandler } from "./loadingHandler";

axios.interceptors.request.use(
    config => {
        loadingHandler.show();
        return config;
    },
    error => {
        loadingHandler.hide();
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        loadingHandler.hide();
        return response;
    },
    error => {
        loadingHandler.hide();
        return Promise.reject(error);
    }
);

export default axios;
