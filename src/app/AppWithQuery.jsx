import { lazy, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "../services/query/queryClient";
import { QueryErrorBoundary } from "../components/common/QueryErrorBoundary";

// routes
import { RootLayout } from "./RootLayout";
import { SuspenseRoute } from "./SuspenseRoute";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoutes } from "./ProtectedRoutes";

// Lazy-loaded components
const LazyHome = lazy(() => import("./../pages/Home/Home"));
const LazyRegister = lazy(() => import("./../pages/Register/Register"));
const LazyLogin = lazy(() => import("./../pages/Login/Login"));
const LazyTest = lazy(() => import("./../pages/TestExam/TestExam"));
const LazyAbout = lazy(() => import("../pages/About/About"));
const LazyFaqPage = lazy(() => import("../pages/FAQ/FaqPage"));
const LazyExamsPage = lazy(() => import("../pages/Exams/ExamsPageWithQuery")); // Using the new query-based component
const LazyPaymentPage = lazy(() => import("../pages/Payment/PaymentPage"));
const LazyStatistics = lazy(() =>
  import("../pages/Statistics/StatisticsLayout")
);

import { LoadingSpinner } from "../components/layout/LoadingSpinner";

// styling
import "../assets/styles/App.css";
import theme from "./../assets/theme/theme";
// hooks
import { useCompanyStore } from "../store/useCompanyStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFavicon, useTitle } from "ahooks";

// misc
import { EDU_URL } from "../services/api/constants";
import { textTemplates } from "./../utils/statics/templates";
// CSRF Setup
import { setupCSRF } from "../services/auth/authService";

function AppWithQuery() {
  const initCompanyData = useCompanyStore((state) => state.initCompanyData);
  const initAuth = useAuthStore((state) => state.initAuth);
  const initCompanyDataLoading = useCompanyStore(
    (state) => state.initCompanyDataLoading
  );
  const initTokenLoading = useAuthStore((state) => state.initTokenLoading);

  useFavicon(EDU_URL + "/logo");
  useTitle(textTemplates.documentTitle);

  useEffect(() => {
    // Initialize authentication and company data
    const initialize = async () => {
      try {
        // Log the persisted authentication state before initialization
        console.log(
          "Initial auth state:",
          useAuthStore.getState().isAuthenticated
        );

        // Initialize authentication first
        await initAuth();
        console.log(
          "Auth state after initAuth:",
          useAuthStore.getState().isAuthenticated
        );

        // Setup CSRF protection (but don't fail the app if it doesn't work)
        try {
          await setupCSRF();
        } catch (csrfError) {
          console.warn(
            "CSRF setup issue, continuing without CSRF protection:",
            csrfError.message
          );
        }

        // Initialize company data
        initCompanyData();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initialize();
  }, [initAuth, initCompanyData]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <QueryErrorBoundary>
            <Routes>
              {initCompanyDataLoading && initTokenLoading ? (
                <Route path="/" element={<LoadingSpinner />} />
              ) : (
                <>
                  <Route element={<RootLayout />}>
                    <Route element={<SuspenseRoute />}>
                      <Route index element={<LazyHome />} />
                      <Route path="/about" element={<LazyAbout />} />
                      <Route path="/faq" element={<LazyFaqPage />} />
                      <Route path="*" element={<LazyHome />} />
                    </Route>
                    {/* protected only routes  */}
                    <Route element={<ProtectedRoutes />}>
                      <Route path="/exams" element={<LazyExamsPage />} />
                      <Route path="/payment" element={<LazyPaymentPage />} />
                      <Route path="/test/:id" element={<LazyTest />} />
                    </Route>
                    {/* public only routes  */}
                    <Route element={<PublicRoute />}>
                      <Route path="/login" element={<LazyLogin />} />
                      <Route path="/register" element={<LazyRegister />} />
                    </Route>
                  </Route>
                  <Route>
                    {/* other routes which has different layout  */}
                    <Route element={<ProtectedRoutes />}>
                      <Route path="/statistics" element={<LazyStatistics />} />
                    </Route>
                  </Route>
                </>
              )}
            </Routes>
          </QueryErrorBoundary>
        </BrowserRouter>
      </ChakraProvider>
      {/* Only show devtools in development */}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default AppWithQuery;
