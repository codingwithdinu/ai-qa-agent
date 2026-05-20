import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { socket } from "../services/socket";

const NotificationContext =
  createContext<any>(null);

export function NotificationProvider({
  children,
}: any) {

  const [notifications, setNotifications] =
    useState<any[]>([]);

  useEffect(() => {

    socket.on(
      "notification",
      (data) => {

        setNotifications((prev) => [
          data,
          ...prev,
        ]);
      }
    );

    return () => {
      socket.off("notification");
    };

  }, []);

  return (

    <NotificationContext.Provider
      value={{
        notifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}