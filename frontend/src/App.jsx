import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Layout
import Layout from "@/components/layout/Layout";

// Pages
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Expenses from "./components/pages/expense/Expenses";
import Groups from "./components/pages/group/Groups";
import GroupDetails from "./components/pages/group/GroupDetails";
import JoinGroup from "./components/pages/group/JoinGroup";
import Profile from "./components/pages/profile/Profile";

// ================= ROUTE GUARDS =================

function PrivateRoute({ children }) {
  const { access } = useSelector((state) => state.auth);
  return access ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { access } = useSelector((state) => state.auth);
  return access ? <Navigate to="/dashboard" replace /> : children;
}

// ================= APP =================

export default function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/join/:token"
          element={<JoinGroup />}
        />

        {/* AUTH */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* EXPENSES */}
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Layout>
                <Expenses />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* GROUPS LIST */}
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <Layout>
                <Groups />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/groups/:id"
          element={
            <PrivateRoute>
              <Layout>
                <GroupDetails />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}