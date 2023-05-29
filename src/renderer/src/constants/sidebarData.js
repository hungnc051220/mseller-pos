import { AiOutlineHome } from "react-icons/ai";
import { BiCategory, BiUserCircle } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineEventNote, MdRestaurantMenu } from "react-icons/md";
import { GiAlarmClock } from 'react-icons/gi';
import { BsLayoutTextSidebarReverse } from 'react-icons/bs';

const sidebarData = [
  {
    route: "/",
    title: "Trang chủ",
    icon: AiOutlineHome,
  },
  {
    route: "/waiting-food",
    title: "Món đang chờ",
    icon: BiCategory,
    count: true
  },
  {
    route: "/orders",
    title: "Quản lý đơn hàng",
    icon: MdOutlineEventNote,
  },
  {
    route: "/menu",
    title: "Quản lý thực đơn",
    icon: MdRestaurantMenu,
  },
  {
    route: "/shifts",
    title: "Quản lý ca",
    icon: GiAlarmClock,
  },
  {
    route: "/staffs",
    title: "Quản lý nhân viên",
    icon: BiUserCircle,
  },
  {
    route: "/cost-revenue",
    title: "Quản lý thu chi",
    icon: BsLayoutTextSidebarReverse,
  },
  // {
  //   route: "/e-invoice",
  //   title: "eInvoice",
  //   icon: RiBillLine,
  // },
  {
    route: "/report",
    title: "Báo cáo",
    icon: HiOutlineDocumentReport,
  },
];

export default sidebarData;