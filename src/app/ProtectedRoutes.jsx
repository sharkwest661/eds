import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { SuspenseRoute } from "./SuspenseRoute";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";

export const ProtectedRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initAuth = useAuthStore((state) => state.initAuth);
  const initTokenLoading = useAuthStore((state) => state.initTokenLoading);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      const authenticated = await initAuth();
      setIsVerified(authenticated);
      setIsLoading(false);
    };

    if (initTokenLoading) {
      verifyAuth();
    } else {
      setIsVerified(isAuthenticated);
      setIsLoading(false);
    }
  }, [initAuth, isAuthenticated, initTokenLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isVerified ? (
    <SuspenseRoute />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
