import React from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { SuspenseRoute } from "./SuspenseRoute";

export const ProtectedRoutes = () => {
  const token =
    useAuthStore((state) => state.token) ||
    localStorage.getItem("notSafeAuthToken");

  return token ? <SuspenseRoute /> : <Navigate to="/login" />;
};
