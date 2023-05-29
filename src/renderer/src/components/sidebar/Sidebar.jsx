import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { images, sidebarData } from "../../constants";
import { classNames } from "@/utils/common";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { logOut } from "@/features/auth/authSlice";
import { FiSettings } from "react-icons/fi";
import { Scrollbars } from "react-custom-scrollbars-2";
import { apiSlice } from "@/api/apiSlice";

const SidebarLink = (props) => {
  const { t } = useTranslation();

  return (
    <li>
      <NavLink
        to={props.route}
        className={({ isActive }) =>
          classNames(
            isActive ? "bg-primary text-white" : "text-primary",
            "flex h-[53px] cursor-pointer items-center gap-2 rounded-r-[10px] pl-[50px]"
          )
        }
        onClick={() => (window.innerWidth < 640 ? setToggle(false) : undefined)}
      >
        <props.icon size={20} />
        {t(props.title)}
        {props.count && props.total > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm text-white">
            {props.total}
          </span>
        )}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ total, toggle, setToggle }) => {
  const dispatch = useDispatch();
  const [clock, setClock] = useState(new Date().toLocaleTimeString("vi-VN"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      setClock(date.toLocaleTimeString("vi-VN"));
    }, [1000]);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <aside
      className={classNames(
        !toggle ? "-left-full" : "left-0",
        "fixed top-0 z-30 flex min-w-[260px] flex-col border-r border-[#F4F4F4] bg-white duration-500"
      )}
    >
      <div
        className="absolute -right-5 top-[50%] z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-md"
        onClick={() => setToggle((prev) => !prev)}
      >
        <HiOutlineChevronLeft size={18} className="text-primary" />
      </div>
      <Scrollbars autoHide style={{ height: "100vh" }}>
        <div className="flex h-full flex-col">
          <div className="flex items-center pl-12 pt-12">
            <img src={images.logoText} alt="logo" />
          </div>

          <div className="flex flex-col justify-center pl-12 mt-2">
            <h1 className="text-[38px] font-bold text-black1">{clock}</h1>
            <p className="text-base text-black1">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <ul className="mt-12 space-y-2 pr-3">
            {sidebarData.map((item, index) => {
              return (
                <SidebarLink
                  key={index}
                  route={item.route}
                  title={item.title}
                  icon={item.icon}
                  count={item.count}
                  total={total}
                />
              );
            })}
          </ul>
          <div className="flex flex-1 items-end py-10 pb-16">
            <ul className="w-full pr-3">
              <SidebarLink route="/setting" title="Cài đặt" icon={FiSettings} />
              <li
                className="mt-1 flex cursor-pointer items-center gap-2 py-2 pl-[50px]"
                onClick={() => {
                  dispatch(logOut());
                  dispatch(apiSlice.util.resetApiState())
                }}
              >
                <BiLogOut color="red" size={18} />
                <p className="text-red-500">Đăng xuất</p>
              </li>
            </ul>
          </div>
        </div>
      </Scrollbars>
    </aside>
  );
};

export default Sidebar;
