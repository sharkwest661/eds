import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { SuspenseRoute } from "./SuspenseRoute";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";

export const PublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initAuth = useAuthStore((state) => state.initAuth);
  const initTokenLoading = useAuthStore((state) => state.initTokenLoading);

  // Get the redirect location from state (if available)
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      await initAuth();
      setIsLoading(false);
    };

    if (initTokenLoading) {
      verifyAuth();
    } else {
      setIsLoading(false);
    }
  }, [initAuth, initTokenLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to={from} replace /> : <SuspenseRoute />;
};
