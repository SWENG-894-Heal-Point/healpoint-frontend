import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import './styles/global.css';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SignupPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </Router>
  )
}

export default App;
