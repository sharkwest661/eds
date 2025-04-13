import React, { Suspense } from "react";
import { Outlet } from "react-router";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";

export const SuspenseRoute = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Outlet />
    </Suspense>
  );
};
