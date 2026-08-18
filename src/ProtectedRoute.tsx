import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "./store/userStore";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useUserStore((s: any) => s.isAuthenticated);
  const logout = useUserStore((s: any) => s.logout);

  if (!isAuthenticated()) {
    // clear any stale auth and redirect
    try {
      logout();
    } catch (e) {
      // ignore
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
