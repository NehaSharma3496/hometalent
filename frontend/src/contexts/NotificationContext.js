import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";

import io from "socket.io-client";

import * as Config from "../Utils/config.js";
const NotificationContext = createContext();

const initialState = {
  notifications: [],

  unreadCount: 0,

  socket: null,

  isConnected: false,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_SOCKET":
      return { ...state, socket: action.payload };

    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload };

    case "ADD_NOTIFICATION":
      const newNotification = {
        ...action.payload,

        id: Date.now(),

        isRead: false,

        timestamp: new Date().toISOString(),
      };

      return {
        ...state,

        notifications: [newNotification, ...state.notifications],

        unreadCount: state.unreadCount + 1,
      };

    case "MARK_AS_READ":
      return {
        ...state,

        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        ),

        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case "MARK_ALL_AS_READ":
      return {
        ...state,

        notifications: state.notifications.map((notif) => ({
          ...notif,

          isRead: true,
        })),

        unreadCount: 0,
      };

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [], unreadCount: 0 };

    default:
      return state;
  }
};

export const NotificationProvider = ({ children, userType, userId }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // const [socketUrl, setSocketUrl] = useState(null);

  // // Fetch socket_url from API

  // useEffect(() => {
  //   const fetchConfig = async () => {
  //     try {
  //       const response = await fetch(`${Config.base_url}admin/settings`); // replace with your real API endpoint

  //       const data = await response.json();

  //       console.log("response", response);
  //       console.log("data", data);

  //       setSocketUrl(data.data.socket_url);
  //       console.log("Socket", data.data[0].socket_url);
  //     } catch (error) {
  //       console.error("Failed to fetch socket_url:", error);
  //     }
  //   };

  //   fetchConfig();
  // }, []);

  // Connect to socket after we have socket_url

  useEffect(() => {
    if (!userId || !userType) return;


    
    // const socket = io(socketUrl);
    const socket = io(`${Config.socket_url}`)

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");

      dispatch({ type: "SET_CONNECTION_STATUS", payload: true });

      // Identify user type

      if (userType === "admin") {
        socket.emit("admin-connect", userId);
      } else if (userType === "vendor") {
        socket.emit("vendor-connect", userId);
      } else if (userType === "client") {
        socket.emit("client-connect", userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");

      dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
    });

    socket.on("notification", (data) => {
      console.log("Received notification:", data);

      dispatch({ type: "ADD_NOTIFICATION", payload: data });
    });

    dispatch({ type: "SET_SOCKET", payload: socket });

    return () => {
      socket.disconnect();
    };
  }, [userType, userId]);

  // Expose functions

  const markAsRead = (notificationId) => {
    dispatch({ type: "MARK_AS_READ", payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  };

  const clearNotifications = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
  };

  const value = {
    ...state,

    markAsRead,

    markAllAsRead,

    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }

  return context;
};
