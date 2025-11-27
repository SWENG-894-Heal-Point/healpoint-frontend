import {BrowserRouter as Router} from 'react-router-dom';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import LoadingProvider from "./components/loading/LoadingContext.jsx";
import './components/loading/axiosConfig.js';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <LoadingProvider>
            <Router>
                <App/>
            </Router>
        </LoadingProvider>
    </StrictMode>,
)
