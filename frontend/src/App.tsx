import {
  lazy,
  Suspense,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  PERMISSIONS,
} from "@/features/auth/permissions";

import {
  LoadingPage,
} from "@/components/common/LoadingPage";

import {
  PermissionRoute,
} from "@/routes/PermissionRoute";

import {
  ProtectedRoute,
} from "@/routes/ProtectedRoute";

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then(
    (module) => ({
      default: module.LoginPage,
    }),
  ),
);

const Dashboard = lazy(() =>
  import("@/features/dashboard").then(
    (module) => ({
      default: module.Dashboard,
    }),
  ),
);

const CustomersPage = lazy(() =>
  import("@/features/customers").then(
    (module) => ({
      default: module.CustomersPage,
    }),
  ),
);

const OpportunitiesPage = lazy(() =>
  import("@/features/opportunities").then(
    (module) => ({
      default:
        module.OpportunitiesPage,
    }),
  ),
);

const PipelinePage = lazy(() =>
  import("@/features/pipeline").then(
    (module) => ({
      default: module.PipelinePage,
    }),
  ),
);

const ActivitiesPage = lazy(() =>
  import("@/features/activities").then(
    (module) => ({
      default: module.ActivitiesPage,
    }),
  ),
);

const ReportsPage = lazy(() =>
  import("@/features/reports").then(
    (module) => ({
      default: module.ReportsPage,
    }),
  ),
);

const UsersPage = lazy(() =>
  import("@/features/users").then(
    (module) => ({
      default: module.UsersPage,
    }),
  ),
);

function App() {
  const accessToken =
    localStorage.getItem(
      "titancrm_access_token",
    );

  return (
    <Suspense
      fallback={
        <LoadingPage
          message="Cargando TitanCRM..."
          minHeight="100vh"
        />
      }
    >
      <Routes>
        <Route
          path="/login"
          element={
            accessToken ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PermissionRoute
                permission={
                  PERMISSIONS.DASHBOARD_VIEW
                }
              >
                <Dashboard />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <PermissionRoute
                permission={
                  PERMISSIONS.CUSTOMERS_VIEW
                }
              >
                <CustomersPage />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <PermissionRoute
                permission={
                  PERMISSIONS.OPPORTUNITIES_VIEW
                }
              >
                <OpportunitiesPage />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pipeline"
          element={
            <ProtectedRoute>
              <PermissionRoute
                permission={
                  PERMISSIONS.PIPELINE_VIEW
                }
              >
                <PipelinePage />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <PermissionRoute
                permission={
                  PERMISSIONS.ACTIVITIES_VIEW
                }
              >
                <ActivitiesPage />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <PermissionRoute
                permission={
                  PERMISSIONS.REPORTS_VIEW
                }
              >
                <ReportsPage />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <PermissionRoute
                permission={
                  PERMISSIONS.USERS_VIEW
                }
              >
                <UsersPage />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to={
                accessToken
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={
                accessToken
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;