import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../components/common/Spinner";

// -- public pages -- //

const LoginPage = lazy(() => import("../features/auth/pages/Login"));
const RegisterPage = lazy(() => import("../features/auth/pages/Register"));
const TaskListing = lazy(() => import("../features/tasks/pages/TaskListing"));
const TaskAddEdit = lazy(() => import("../features/tasks/pages/TaskAddEdit"));

const Loading = () => <Spinner className="min-h-[60vh]" />;

const AppRouter = () => {
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<Layout />}>
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
      </Route>

      <Route
        path="/task/add"
        element={
          <ProtectedRoute>
            <TaskAddEdit />
          </ProtectedRoute>
        }
      ></Route>

      
    </Routes>
  </Suspense>;
};
