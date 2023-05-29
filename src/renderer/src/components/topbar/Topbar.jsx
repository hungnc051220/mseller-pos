import { Avatar } from "antd";
import { useSelector } from "react-redux";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BsFullscreen } from "react-icons/bs";
import { classNames, formatMoney } from "../../utils/common";
import ButtonNotification from "../ButtonNotification";
import { useGetUserQuery } from "../../api/userApiSlice";
import { useGetReportOrderInProgressQuery } from "../../api/reportApiSlice";

const Topbar = ({ toggle, setToggle }) => {
  const user = useSelector((state) => state.auth.user);
  const { data } = useGetUserQuery();
  const { data: dataOrderInProgress } = useGetReportOrderInProgressQuery({
    branchId: user?.branch?.id,
  });

  const goFullScreen = () => {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }

    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    ) {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className={classNames(
        !toggle ? "w-full" : "w-full sm:w-[calc(100%_-_260px)]",
        "fixed right-0 top-0 z-20 flex h-16 items-center justify-between gap-4 bg-primary px-3 py-3 duration-500 ease-in-out"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {!toggle && (
          <AiOutlineMenuUnfold
            color="white"
            size={32}
            className="cursor-pointer"
            onClick={() => setToggle((prev) => !prev)}
          />
        )}
        <Avatar size="large" src={data?.avatar} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">
            {data?.company?.companyName}
          </p>
          <p className="truncate text-sm text-white">
            {data?.company?.address}
          </p>
        </div>
      </div>

      <div className="hidden items-center justify-center gap-2 rounded-lg border border-white px-2 py-1 text-white sm:flex">
        <p className="text-gray-100">
          Đơn đang xử lý:{" "}
          <span className="text-lg font-bold text-white">
            {dataOrderInProgress?.total || 0}
          </span>{" "}
        </p>
        <p className="text-gray-100">|</p>
        <p className="text-gray-100">
          Số tiền cần thanh toán:{" "}
          <span className="text-lg font-bold text-white">
            {formatMoney(dataOrderInProgress?.totalNetPrice || 0)}đ
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ButtonNotification />
        <div
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] bg-white/30"
          onClick={goFullScreen}
        >
          <BsFullscreen size={18} color="white" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
