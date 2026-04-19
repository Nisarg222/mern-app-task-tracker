import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../components/common/Spinner";

const LoginPage = lazy(() => import("../features/auth/pages/Login"));
const RegisterPage = lazy(() => import("../features/auth/pages/Register"));
const TaskListing = lazy(() => import("../features/tasks/pages/TaskListing"));
const TaskAddEdit = lazy(() => import("../features/tasks/pages/TaskAddEdit"));

const Loading = () => <Spinner className="min-h-[60vh]" />;

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* redirect root to login */}
          <Route index element={<Navigate to="/login" replace />} />

          {/* public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected routes */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/add"
            element={
              <ProtectedRoute>
                <TaskAddEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/edit/:id"
            element={
              <ProtectedRoute>
                <TaskAddEdit />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
