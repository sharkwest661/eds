import { lazy, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// routes
import { RootLayout } from "./RootLayout";
import { SuspenseRoute } from "./SuspenseRoute";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoutes } from "./ProtectedRoutes";

const LazyHome = lazy(() => import("./../pages/Home/Home"));
const LazyRegister = lazy(() => import("./../pages/Register/Register"));
const LazyLogin = lazy(() => import("./../pages/Login/Login"));
const LazyTest = lazy(() => import("./../pages/TestExam/TestExam"));
const LazyAbout = lazy(() => import("../pages/About/About"));
const LazyFaqPage = lazy(() => import("../pages/FAQ/FaqPage"));
const LazyExamsPage = lazy(() => import("../pages/Exams/ExamsPage"));
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

function App() {
  const initCompanyData = useCompanyStore((state) => state.initCompanyData);
  const initToken = useAuthStore((state) => state.initToken);
  const initCompanyDataLoading = useCompanyStore(
    (state) => state.initCompanyDataLoading
  );
  const initTokenLoading = useAuthStore((state) => state.initTokenLoading);

  useFavicon(EDU_URL + "/logo");
  useTitle(textTemplates.documentTitle);

  useEffect(() => {
    initToken();
    initCompanyData();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
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
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
