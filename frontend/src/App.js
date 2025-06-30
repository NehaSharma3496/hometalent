import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebRoutes from './routes/WebRoutes.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import Login from './auth/Login.jsx';
import Registration from './auth/Registration.jsx';

function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Registration/>} />
          {WebRoutes}
          {AdminRoutes}
          
        </Routes>

      </Router>
    </>
  );
}

export default App;
