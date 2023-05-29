import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Form, Modal, Input, Table } from "antd";
import { toast } from "react-toastify";
import { useCancelOrderMutation } from "../../../api/orderApiSlice";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { formatMoney } from "../../../utils/common";
import { createQrCode, createQrCodeStatic } from "../../../api";
import { useState } from "react";
import { useEffect } from "react";
const { TextArea } = Input;
import QRCode from "react-qr-code";

export const ContentPrint = ({ componentRef, order, qrCode }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="hidden">
      <div
        ref={componentRef}
        className="w-full flex-col items-center justify-center pb-10"
      >
        <h3 className="text-center text-lg font-bold">
          {user?.company?.companyName}
        </h3>
        <p className="text-center text-xs">Địa chỉ:</p>
        <p className="text-center text-xs">Hotline: {user?.phoneNumber}</p>

        <h4 className="my-2 text-center text-lg font-bold">HOÁ ĐƠN BÁN HÀNG</h4>

        <div className="space-y-[2px] pb-2">
          <div className="flex w-full">
            <p className="w-3/5 text-xs">Số HĐ: {order?.code.substring(7)}</p>
            <p className="w-2/5 flex-1 whitespace-nowrap text-xs">
              Ngày: {dayjs().format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="flex w-full">
            <p className="w-3/5 whitespace-nowrap text-xs">
              {order?.floor
                ? `Vị trí: ${order?.floor?.name} - ${order?.table?.name}`
                : `KH: ${order?.customerName || ""}`}
            </p>
            <p className="w-2/5 whitespace-nowrap text-xs">
              Giờ: {dayjs().format("HH:mm")}
            </p>
          </div>
          <p className="text-xs">
            {" "}
            Nhân viên: {order?.logs[0]?.user?.fullName}
          </p>
        </div>

        <table className="mt-1 w-full">
          <thead className="border-b border-gray-900">
            <tr>
              <th className="text-xs font-bold">Tên món</th>
              <th className="text-xs font-bold">SL</th>
              <th className="text-xs font-bold">Đơn giá</th>
              <th className="text-xs font-bold">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {order?.foods?.map((food) => (
              <tr key={food.index}>
                <td className="py-1 pr-3 text-xs">{food.name}</td>
                <td className="py-1 px-3 text-xs">{food.quantity}</td>
                <td className="py-1 px-3 text-right text-xs">
                  {formatMoney(food.price)}
                </td>
                <td className="py-1 pl-3 text-right text-xs">
                  {formatMoney(food.price * food.quantity)}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 w-full space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Tổng cộng</p>
            <p className="text-xs font-bold">
              {formatMoney(order?.totalPrice)}đ
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Chiết khấu</p>
            <p className="text-xs font-bold">
              {formatMoney(
                order?.discountType === "PERCENT"
                  ? (order?.totalPrice * order?.discount || 0) / 100
                  : order?.discount || 0
              )}
              đ
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Phụ thu</p>
            <p className="text-xs font-bold">
              {formatMoney(
                order?.surchargeType === "PERCENT"
                  ? (order?.totalPrice * order?.surcharge || 0) / 100
                  : order?.surcharge || 0
              )}
              đ
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold">Thành tiền</p>
            <p className="text-xs font-bold">
              {formatMoney(order?.totalNetPrice)}đ
            </p>
          </div>
        </div>

        {qrCode && (
          <QRCode value={qrCode} size={120} className="mx-auto mt-4" />
        )}

        <div className="text-center">
          <p className="mt-4 text-center text-xs font-medium">
            {user?.company?.companyName} xin chân thành cảm ơn!
          </p>
          <p className="text-xs">mSeller - Powered by MB</p>
        </div>
      </div>
    </div>
  );
};

const PrintOrder = ({ order, componentRef, handlePrint }) => {
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState("null");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order?.code) return;
    const createQr = async () => {
      try {
        const response = await createQrCodeStatic();
        //   {
        //   orderCode: order.code,
        //   notice: `thanh toan`,
        // }
        var reader = new window.FileReader();
        reader.readAsText(response.data);
        reader.onload = function () {
          var imageDataUrl = reader.result;
          setQrCode(imageDataUrl);
        };
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    createQr();
  }, [order?.code]);

  return (
    <>
      <Button
        size="large"
        className="max-w-[250px] flex-1"
        loading={loading}
        onClick={() => {
          handlePrint();
        }}
      >
        In tạm tính (F9)
      </Button>
      {order && qrCode && !loading && (
        <ContentPrint
          componentRef={componentRef}
          order={order}
          qrCode={qrCode}
        />
      )}
    </>
  );
};

export default PrintOrder;
