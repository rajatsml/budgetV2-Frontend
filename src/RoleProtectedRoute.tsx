import { Navigate } from "react-router-dom";
import useUserStore from "./store/userStore";

const RoleProtectedRoute = ({ children, allowedRoles }: any) => {
  const user = useUserStore((s: any) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
