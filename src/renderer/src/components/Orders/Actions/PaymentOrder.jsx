import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, QRCode, Segmented, Skeleton, Table } from "antd";
import { formatMoney } from "../../../utils/common";
import { AiOutlineQrcode } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BsCash } from "react-icons/bs";
import {
  useAcceptPayOrderMutation,
  usePayOrderMutation,
  useStopFoodOrderMutation,
} from "../../../api/orderApiSlice";
import { createQrCode, createQrCodeStatic } from "../../../api";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { ContentPrint } from "./PrintOrder";

// const ContentPrint = ({ componentRef, order }) => {
//   const { user } = useSelector((state) => state.auth);

//   const columns = [
//     {
//       title: "Tên món",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Số lượng",
//       dataIndex: "quantity",
//       key: "quantity",
//       align: "center",
//       width: "20%",
//     },
//     {
//       title: "Đơn giá",
//       dataIndex: "price",
//       key: "price",
//       render: (text) => formatMoney(text) + "đ",
//       align: "right",
//       width: "20%",
//     },
//   ];

//   return (
//     <div className="hidden">
//       <div ref={componentRef} className="w-full flex-col p-2">
//         <h3 className="text-center text-xl font-medium">
//           {user.company.companyName}
//         </h3>
//         <p className="text-center">Địa chỉ:</p>

//         <h4 className="my-6 text-center text-xl">
//           HOÁ ĐƠN THANH TOÁN <br /> (FINAL CHECK)
//         </h4>

//         <div className="border-b border-dotted border-gray-200 pb-4">
//           <div className="flex items-center justify-between">
//             <p>Mã đơn hàng: {order?.code}</p>
//             <p>{order?.table?.name}</p>
//           </div>
//           <p>Giờ in: {dayjs().format("HH:mm DD/MM/YYYY")}</p>
//           <p>Nhân viên:</p>
//         </div>
//         <Table
//           dataSource={order?.foods}
//           columns={columns}
//           pagination={false}
//           rowKey={() => `${Math.random()}`}
//           footer={() => (
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <p className="font-medium">Thành tiền</p>
//                 <p>{formatMoney(order?.totalNetPrice)}đ</p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="font-medium">Khuyến mãi</p>
//                 <p>Không có</p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="font-medium">Tổng tiền</p>
//                 <p>{formatMoney(order?.totalNetPrice)}đ</p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="font-medium">Hình thức thanh toán</p>
//                 <p>{order?.paymentType === "CASH" ? "Tiền mặt" : "Mã QR"}</p>
//               </div>
//             </div>
//           )}
//         />

//         <p className="mt-4 text-center font-medium">
//           Cảm ơn quý khách và hẹn gặp lại! <br />
//           Thank you and see you again!
//         </p>
//       </div>
//     </div>
//   );
// };

const PaymentOrder = ({ order, open, setOpen, refetch, openTbilling, setOpenTbilling }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("CASH");
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payOrder, { isLoading: isLoadingPayment }] = usePayOrderMutation();
  const [acceptPayOrder, { isLoading: isLoadingAcceptPayOrder }] =
    useAcceptPayOrderMutation();
  const [stopFood, { isLoading: isLoadingStopFood }] =
    useStopFoodOrderMutation();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const foodBillingTimes = order?.foods.filter(
    (food) => food.tbillingTime === true && !food.billingTime?.endTime
  );

  useEffect(() => {
    if (!order?.code) return;
    const createQr = async () => {
      try {
        const response = await createQrCode({
          orderCode: order.code,
          notice: `thanh toan`,
        });
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

  const onPayment = async (type) => {
    try {
      const response = await payOrder({
        orderId: order?.id,
        paymentType: type ? type : paymentType,
      }).unwrap();
      navigate(-1);
      return response;
    } catch (error) {
      toast.error("Thanh toán thất bại");
      return error;
    }
  };

  const onPaymentAndPrint = async () => {
    const response = await onPayment();
    if (response?.status !== 400) {
      handlePrint();
    }
  };

  const onStopFood = async () => {
    const bodyData = {
      dateTime: dayjs().format(),
      orderId: order.id,
      foodIndexes: foodBillingTimes.map(item => item.index),
    };
    try {
      await stopFood(bodyData).unwrap();
      refetch();
      setOpenTbilling(false);
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        className="max-w-[250px] flex-1 bg-orange-500 hover:bg-orange-400"
        onClick={() => {
          if (foodBillingTimes.length > 0) {
            setOpenTbilling(true);
          } else setOpen(true);
        }}
      >
        Thanh toán (F2)
      </Button>
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <div className="flex-1 space-y-3 rounded-xl">
          <h2 className="mb-4 mt-8 text-center text-xl font-bold">
            Thanh toán
          </h2>
          <div className="flex items-center justify-between text-base">
            <p>Tổng tiền</p>
            <p>{formatMoney(order?.totalPrice)}đ</p>
          </div>
          <div className="flex items-center justify-between text-base">
            <p>Chiết khấu</p>
            <p className="text-red-500">
              {formatMoney(
                order?.discountType === "PERCENT"
                  ? (order.totalPrice * order?.discount || 0) / 100
                  : order?.discount || 0
              )}
              đ
            </p>
          </div>
          <div className="flex items-center justify-between text-base">
            <p>Phụ thu</p>
            <p className="text-primary">
              {formatMoney(
                order?.surchargeType === "PERCENT"
                  ? (order.totalPrice * order?.surcharge || 0) / 100
                  : order?.surcharge || 0
              )}
              đ
            </p>
          </div>
          <div className="flex items-center justify-between border-b border-dashed pb-4 text-base">
            <p>Khuyến mãi</p>
            <p>Không có</p>
          </div>

          <div className="flex items-center justify-between text-base">
            <p>Thành tiền</p>
            <p className="text-lg font-semibold">
              {formatMoney(order?.totalNetPrice)}đ
            </p>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center py-6">
              <Segmented
                size="large"
                value={paymentType}
                onChange={(value) => setPaymentType(value)}
                options={[
                  {
                    label: (
                      <div className="flex items-center justify-center gap-2">
                        <BsCash />
                        <p>Tiền mặt</p>
                      </div>
                    ),
                    value: "CASH",
                  },
                  {
                    label: (
                      <div className="flex items-center justify-center gap-2">
                        <AiOutlineQrcode />
                        <p>Mã QR</p>
                      </div>
                    ),
                    value: "QR_CODE",
                  },
                ]}
              />
              {paymentType === "QR_CODE" && (
                <>
                  {loading ? (
                    <Skeleton.Node
                      active={true}
                      className="mt-4 h-[250px] w-[250px]"
                    >
                      <div className="flex flex-col items-center">
                        <AiOutlineQrcode size={120} className="opacity-20" />
                        <p>Đang tải</p>
                      </div>
                    </Skeleton.Node>
                  ) : qrCode ? (
                    <div className="mt-4 flex items-center justify-center">
                      <QRCode value={qrCode} size={250} />
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>

            <div className="mb-2 mt-2 flex w-full flex-wrap items-center gap-2">
              <Button
                size="large"
                className="flex-1 border-none bg-orange-500 text-white hover:bg-orange-400"
                onClick={() => onPayment("QR_STATIC")}
                loading={isLoadingPayment}
              >
                {t("Đã thanh toán qua QR tĩnh")}
              </Button>
              <Button
                type="primary"
                size="large"
                className="flex-1"
                onClick={onPaymentAndPrint}
                loading={isLoadingPayment}
              >
                Thanh toán
              </Button>
            </div>

            <ContentPrint
              componentRef={componentRef}
              order={order}
              qrCode={qrCode}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Dừng món ăn tính giờ"
        open={openTbilling}
        onOk={onStopFood}
        onCancel={() => setOpenTbilling(false)}
        okText="Xác nhận"
        okButtonProps={{ danger: true }}
        confirmLoading={isLoadingStopFood}
        cancelText="Đóng"
        destroyOnClose
      >
        <p>
          Trong đơn hiện đang có các món tính giờ. Xác nhận đồng ý dừng để thanh
          toán?
        </p>
      </Modal>
    </>
  );
};

export default PaymentOrder;
