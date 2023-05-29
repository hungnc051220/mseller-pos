import { Button, Modal, Tabs } from "antd";
import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useGetShiftQuery } from "../../api/shiftApiSlice";
import { formatMoney } from "../../utils/common";
import ListOrders from "../Orders/ListOrders";
import CostRevenue from "./CostRevenue/CostRevenue";

const ShiftDetail = ({ selectedShift, setSelectedShift }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetShiftQuery(
    selectedShift ? selectedShift : skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (selectedShift) {
      setIsOpen(true);
    }
  }, [selectedShift]);

  const handleClose = () => {
    setSelectedShift(null);
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onCancel={handleClose} footer={null} width="80vw">
      <h2 className="mt-8 mb-4 text-center text-xl font-bold">
      Chi tiết ca
      </h2>

      <div className="flex flex-col sm:flex-row">
        <div className="w-full space-y-2 pr-2 sm:w-1/3">
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Mã ca:</p>
            <p className="rounded-lg bg-black1 py-1 px-2 font-bold text-white">
              {data?.code}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Trạng thái:</p>
            <p className={data?.status ? "text-primary" : "text-red-500"}>
              {data?.status ? "Đang diễn ra" : "Đã kết thúc"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Tên nhân viên:</p>
            <p className="font-bold text-black1">{data?.employee?.fullName}</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Giờ mở ca:</p>
            <p className="font-bold text-black1">
              {dayjs(data?.timeStartShifts).format("HH:mm DD/MM/YYYY")}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Giờ kết thúc ca:</p>
            <p className="font-bold text-black1">
              {data?.timeCloseShifts
                ? dayjs(data?.timeCloseShifts).format("HH:mm DD/MM/YYYY")
                : "-"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Số dư đầu ca:</p>
            <p className="font-bold text-black1">
              {formatMoney(data?.openingBalance)}đ
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Số dư cuối ca:</p>
            <p className="font-bold text-black1">
              {data?.endingBalance
                ? `${formatMoney(data?.endingBalance)}đ`
                : "-"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Tổng số đơn:</p>
            <p className="font-bold text-black1">{data?.orders?.length}</p>
          </div>
        </div>

        <Tabs
          type="card"
          className="mt-4 w-full pl-4 sm:mt-0 sm:w-2/3"
          defaultActiveKey="1"
          items={[
            {
              label: "Danh sách đơn",
              key: "1",
              children: <ListOrders orders={data?.orders} />,
            },
            {
              label: "Danh sách thu chi",
              key: "2",
              children: <CostRevenue shift={data} isLoading={isLoading} />,
            },
          ]}
        />
      </div>
      <div className="space-y-3 pt-4 text-right">
        <Button size="large" onClick={handleClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default ShiftDetail;
