import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AdminLayout, AuthLayout } from "./layouts";
import {
  CreateAndUpdateOrder,
  ForgotPassword,
  Home,
  Login,
  Menu,
  OrderDetail,
  Orders,
  Register,
  Report,
  Setting,
  Shifts,
  Staffs,
  Waiting,
  EInvoice,
  CostRevenue,
} from "./pages";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { AffiliateAccount, ListEInvoice } from "./components";
import OrderLayout from "./layouts/OrderLayout";

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <div className="app">
      <Routes location={background || location}>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <AdminLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Home />} />
          <Route path="waiting-food" element={<Waiting />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="menu" element={<Menu />} />
          <Route path="setting" element={<Setting />} />
          <Route path="shifts" element={<Shifts />} />
          <Route path="staffs" element={<Staffs />} />
          <Route path="cost-revenue" element={<CostRevenue />} />
          <Route path="e-invoice" element={<EInvoice />}>
            <Route index element={<Navigate to="affiliate-account" />} />
            <Route path="affiliate-account" element={<AffiliateAccount />} />
            <Route path="list" element={<ListEInvoice />} />
          </Route>
          <Route path="report" element={<Report />} />
        </Route>
        <Route
          path="/order"
          element={
            <ProtectedRoutes>
              <OrderLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="create" />} />
          <Route path="create" element={<CreateAndUpdateOrder />} />
          <Route path="edit" element={<CreateAndUpdateOrder isEdit />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/order/:orderId" element={<OrderDetail />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
