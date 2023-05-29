import { Button, message, Segmented, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineQrcode } from "react-icons/ai";
import { BsCash } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { createQrCode } from "../api";
import { useGetOrderQuery, usePayOrderMutation } from "../api/orderApiSlice";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState("");
  const [paymentType, setPaymentType] = useState("QR_CODE");
  const { data } = useGetOrderQuery(orderId);
  const [payOrder, { isLoading: isLoadingPayment }] = usePayOrderMutation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data?.code) return;
    const createQr = async () => {
      try {
        const response = await createQrCode({
          orderCode: data?.code,
          notice: "Thanh toan",
        });
        var reader = new window.FileReader();
        reader.readAsDataURL(response.data);
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
  }, [data?.code]);

  const onPayOrder = async () => {
    try {
      await payOrder({
        orderId: data?.id,
        paymentType,
      }).unwrap();
      navigate("/payment-success", { state: { orderId: data?.id } });
    } catch (error) {
      message.error({
        type: "error",
        content: error?.data?.title,
      });
    }
  };

  return (
    <div className="flex pt-16 pb-32">
      <div className="flex w-full flex-1 flex-col items-center justify-start">
        <div className="text-xl font-semibold">
          {data?.floor.name} - {data?.table.name}
        </div>
        <p className="mt-2 mb-6 text-lg">Các hình thức thanh toán</p>

        <Segmented
          size="large"
          value={paymentType}
          onChange={(value) => setPaymentType(value)}
          options={[
            {
              label: (
                <div className="flex items-center justify-center gap-2">
                  <AiOutlineQrcode />
                  <p>Mã QR</p>
                </div>
              ),
              value: "QR_CODE",
            },
            {
              label: (
                <div className="flex items-center justify-center gap-2">
                  <BsCash />
                  <p>Tiền mặt</p>
                </div>
              ),
              value: "CASH",
            },
          ]}
        />

        {paymentType === "QR_CODE" && (
          <>
            {loading ? <Skeleton.Node active={true} className="mt-4 h-[400px] w-[400px]">
              <div className="flex flex-col items-center">
                <AiOutlineQrcode size={120} className="opacity-20" />
                <p>Đang tải...</p>
              </div>
            </Skeleton.Node>
            : <div className="mt-4 flex items-center justify-center">
              <img
                src={qrCode}
                alt="qr-code"
                className="h-[400px] w-[400px] shadow-md"
              />
            </div>}
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col items-start justify-center">
        <h4 className="text-2xl font-semibold">Thông tin đơn hàng</h4>
        <div className="mt-14 w-[500px] space-y-10 rounded-lg bg-[#FAF6F3] p-8 text-xl shadow">
          <div className="flex items-center justify-between">
            <p className="text-[#8E8E8E]">Mã hoá đơn</p>
            <p>{data?.code}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[#8E8E8E]">Ngày tạo</p>
            <p>{data?.createdAt}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[#8E8E8E]">Món ăn đã gọi</p>
            <p>1</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[#8E8E8E]">Khuyến mãi</p>
            <p>0</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[#8E8E8E]">Tổng cộng</p>
            <p>{data?.totalNetPrice}</p>
          </div>
        </div>

        <div className="mt-10 w-[500px]">
          <Button
            className="h-14 w-full bg-primary text-xl text-white"
            loading={isLoadingPayment}
            onClick={onPayOrder}
          >
            Hoàn tất thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
