import dayjs from "dayjs";
import { formatMoney } from "../../utils/common";
import { Avatar } from "antd";
import { useTranslation } from "react-i18next";

const ShiftCard = ({ shift, setSelectedShift }) => {
  const { t } = useTranslation();
  return (
    <div
      className="cursor-pointer space-y-2 rounded-lg border border-gray-200 p-4 text-sm hover:shadow-md hover:shadow-primary/20"
      onClick={() => setSelectedShift(shift.id)}
    >
      <div className="-mx-4 flex items-center justify-between gap-1 border-b border-gray-200 px-4 pb-2">
        <div className="flex items-center gap-2">
          <Avatar src={shift.employee.avatar} />
          <div>
            <p>{shift.employee.fullName || t("storeOwner")}</p>
            <div className="flex items-center gap-1">
              <div
                className={`h-3 w-3 rounded-full ${
                  !shift.status ? "bg-red-500" : "bg-primary"
                }`}
              ></div>
              <p className={!shift.status ? "text-red-500" : "text-primary"}>
                {!shift.status ? "Kết thúc" : "Đang diễn ra"}
              </p>
            </div>
          </div>
        </div>
        <p className="rounded-md bg-gray-300 py-1 px-2">{shift.code}</p>
      </div>
      <div className="flex items-center justify-between gap-1">
        <p>Giờ mở ca:</p>
        <p>{dayjs(shift.timeStartShifts).format("HH:mm DD/MM/YYYY")}</p>
      </div>
      <div className="flex items-center justify-between gap-1">
        <p>Giờ kết thúc ca:</p>
        <p>
          {shift.timeCloseShifts
            ? dayjs(shift.timeCloseShifts).format("HH:mm DD/MM/YYYY")
            : "-"}
        </p>
      </div>
      <div className="flex items-center justify-between gap-1">
        <p>Số dư đầu ca:</p>
        <p>{formatMoney(shift.openingBalance)}đ</p>
      </div>
      <div className="flex items-center justify-between gap-1">
        <p>Số dư cuối ca:</p>
        <p>
          {formatMoney(shift.endingBalance)}đ
          <span
            className={
              shift.endingBalance - shift.openingBalance >= 0
                ? "text-primary"
                : "text-red-500"
            }
          >{` (${
            shift.endingBalance - shift.openingBalance >= 0 ? "+" : "-"
          }${formatMoney(shift.endingBalance - shift.openingBalance)}đ)`}</span>
        </p>
      </div>
    </div>
  );
};

export default ShiftCard;
