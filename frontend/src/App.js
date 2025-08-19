import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebRoutes from "./routes/WebRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import VendorRoutes from "./routes/VendorRoutes.jsx";
import Login from "./auth/Login.jsx";
import Error from "./pages/website/Error.jsx";
import ScrollToTop from "./components/ScrollToTop";
import {NotificationProvider} from "./contexts/NotificationContext.js";

function App() {
  const roleId = localStorage.getItem("roleId");
  const userId = localStorage.getItem("userId");

  let userType = null;
  if (roleId === "1") userType = "admin";
  else if (roleId === "2") userType = "vendor";
  else userType = "client";
  return (
    <>
      <NotificationProvider userType={userType} userId={userId}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="*" element={<Error />} />
            {WebRoutes}
            {AdminRoutes}
            {VendorRoutes}
          </Routes>
        </Router>
      </NotificationProvider>
    </>
  );
}

export default App;
