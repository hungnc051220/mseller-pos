import images from "./images";
import icons from "./icons";
import sidebarData from "./sidebarData";

const listStatus = {
  WAITING: { color: "text-[#54007B]", bgColor: "bg-[#ECDEF2]", text: "Chờ xác nhận"},
  CREATED: { color: "text-[#E58C05]", bgColor: "bg-[#FFE9C9]", text: "Đang xử lý" },
  COMPLETED: { color: "text-[#02C081]", bgColor: "bg-[#E1FFF7]", text: "Hoàn thành" },
  CANCELLED: { color: "text-[#E13641]", bgColor: "bg-[#FFE2E2]", text: "Huỷ bỏ" },
};

const listStatusAction = {
    ADD_FOOD: { color: "green", text: "Thêm món"},
    DEL_FOOD: { color: "red", text: "Xoá món"},
    SUB_FOOD: { color: "orange", text: "Giảm món"},
    UPD_DISCOUNT: { color: "blue", text: "Thêm chiết khấu"},
    UPD_SURCHARGE: { color: "blue", text: "Thêm phụ thu"},
  };

export { images, icons, sidebarData, listStatus, listStatusAction };
