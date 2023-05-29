import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const ProtectedRoutes = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
