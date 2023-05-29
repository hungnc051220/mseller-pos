import images from "./images";
import icons from "./icons";
import sidebarData from "./sidebarData";

const listStatus = {
  WAITING: { color: "text-[#54007B]", bgColor: "bg-[#ECDEF2]" },
  CREATED: { color: "text-[#E58C05]", bgColor: "bg-[#FFE9C9]" },
  COMPLETED: { color: "text-[#02C081]", bgColor: "bg-[#E1FFF7]" },
  CANCELLED: { color: "text-[#E13641]", bgColor: "bg-[#FFE2E2]" },
};

const listStatusAction = {
    ADD_FOOD: { color: "green"},
    DEL_FOOD: { color: "red"},
    SUB_FOOD: { color: "orange"},
    UPD_DISCOUNT: { color: "blue"},
    UPD_SURCHARGE: { color: "blue"},
  };

export { images, icons, sidebarData, listStatus, listStatusAction };
