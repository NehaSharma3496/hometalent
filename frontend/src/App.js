import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebRoutes from './routes/WebRoutes.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import VendorRoutes from './routes/VendorRoutes.jsx';
import Login from './auth/Login.jsx';
import Error from './pages/website/Error.jsx';


function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
        
          <Route path="*" element={<Error />} />
          {WebRoutes}
          {AdminRoutes}
          {VendorRoutes}
        </Routes>

      </Router>
    </>
  );
}

export default App;
