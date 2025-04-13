import React from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { SuspenseRoute } from "./SuspenseRoute";

export const PublicRoute = () => {
  const token =
    useAuthStore((state) => state.token) ||
    localStorage.getItem("notSafeAuthToken");

  return token ? <Navigate to="/" /> : <SuspenseRoute />;
};
