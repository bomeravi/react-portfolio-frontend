import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReactGA from "react-ga4";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";
import { AxiosInterceptor } from "./components/AxiosInterceptor";
import ErrorBoundary from "./providers/ErrorBoundary";
import HomePage from "./pages/HomePage";
import { ROUTES } from "./constants/routes";

const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Diaries = lazy(() => import("./pages/Diaries"));
const DiaryDetail = lazy(() => import("./pages/DiaryDetail"));
const CreateDiary = lazy(() => import("./pages/CreateDiary"));
const EditDiary = lazy(() => import("./pages/EditDiary"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className= "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex justify-center items-center" >
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
);

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to={ ROUTES.LOGIN } replace />;
};

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "UA-XXXXX-X";

function AppRoutes() {
  return (
    <Suspense fallback= {< PageLoader />}>
      <Routes>
      <Route path={ ROUTES.HOME } element = {< HomePage />} />
        < Route path = { ROUTES.BLOG.LIST } element = {< BlogList />} />
          < Route path = { ROUTES.BLOG.ROUTE } element = {< BlogDetail />} />
            < Route path = { ROUTES.LOGIN } element = {< Login />} />
              < Route
path = { ROUTES.ADMIN.DASHBOARD }
element = {< ProtectedRoute element = {< AdminDashboard />} />}
        />
  < Route path = { ROUTES.DIARY.LIST } element = {< ProtectedRoute element = {< Diaries />} />} / >
    <Route path={ ROUTES.DIARY.DETAIL_ROUTE } element = {< ProtectedRoute element = {< DiaryDetail />} />} / >
      <Route
path = { ROUTES.DIARY.CREATE }
element = {< ProtectedRoute element = {< CreateDiary />} />}
        />
  < Route
path = { ROUTES.DIARY.EDIT_ROUTE }
element = {< ProtectedRoute element = {< EditDiary />} />}
        />
  </Routes>
  </Suspense>
  );
}

function App() {
  ReactGA.initialize(TRACKING_ID);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });

  return (
    <ThemeProvider>
    <ErrorBoundary>
    <QueryClientProvider client= { queryClient } >
    <ToastProvider>
    <AuthProvider>
    <BrowserRouter>
    <AxiosInterceptor />
    < ToastContainer />
    <AppRoutes />
  { import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={ false } /> }
  </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
    </QueryClientProvider>
    </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;