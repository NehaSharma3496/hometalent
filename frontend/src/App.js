import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import WebRoutes from './routes/WebRoutes.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';


function App() {
  return (
    <>

  <Router>
      <Routes>
        {WebRoutes}
        {AdminRoutes}
      </Routes>
    </Router>

        </>
  );
}

export default App;
