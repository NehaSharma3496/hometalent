import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SessionHandler() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const FOUR_HOURS = 14400000; 
//   const FOUR_HOURS = 60000;

  const logout = () => {
    localStorage.clear();
    Swal.fire({
      title: "Session Expired",
      text: "You have been logged out due to inactivity.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: true,
      confirmButtonText: "OK",
    }).then(() => navigate("/login"));
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, FOUR_HOURS); // starts new 4-hour timer
  };

  useEffect(() => {
    // Start timer on mount
    resetTimer();

    // Reset timer on user activity
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return null;
}

export default SessionHandler;
