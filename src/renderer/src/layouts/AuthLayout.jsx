import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { images } from "../constants";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useEffect } from "react";

const AuthLayout = () => {
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    window.Products.products().then(res => console.log(res));
  }, [])

  return !token ? (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          <Outlet />
          {/* {content()} */}
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="relative z-10 px-14 leading-[60px] text-white">
          <h1 className="mt-14 text-[50px] font-bold">
            Giải pháp Quản lý bán hàng tổng thể
          </h1>
          <p className="mt-3 text-lg">
            Không chỉ là Phần mềm quản lý bán hàng mà chúng tôi cung cấp cho bạn
            một giải pháp kinh doanh toàn diện
          </p>
        </div>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={images.bg}
          alt="login"
        />
      </div>
    </div>
  ) : (
    <Navigate to="/" replace />
  );
};

export default AuthLayout;
