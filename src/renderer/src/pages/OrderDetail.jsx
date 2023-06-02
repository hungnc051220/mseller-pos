import {
  Button,
  Modal,
  notification,
  Segmented,
  Skeleton,
  Spin,
  Table,
  Input,
  Form,
  QRCode,
} from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { classNames, formatMoney } from "../utils/common";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useAcceptOrderMutation,
  useRefuseOrderMutation,
  useCancelOrderMutation,
  useGetOrderByTableQuery,
  useGetOrderQuery,
  usePayOrderMutation,
  useGetOrderDetailChangeQuery,
} from "../api/orderApiSlice";
import { useEffect } from "react";
import { AiOutlineHistory, AiOutlineQrcode } from "react-icons/ai";
import { BsCash, BsListStars, BsPencilSquare } from "react-icons/bs";
import { createQrCode, createQrCodeStatic } from "../api";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { HistoryOrder, UpdateOrder } from "../components";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { ContentPrint } from "../components/Orders/Actions/PrintOrder";
import { listStatus } from "../constants";

const { TextArea } = Input;

const StepDetail = ({
  order,
  isLoading,
  handleClose,
  t,
  setStep,
  refetch,
  navigate,
  location,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const getTotalPrice = (list = []) => {
    return list.reduce((price, item) => item.price + price, 0);
  };

  const [acceptOrder, { isLoading: isLoadingAccept }] =
    useAcceptOrderMutation();

  const [refuseOrder, { isLoading: isLoadingRefuse }] =
    useRefuseOrderMutation();

  const [cancelOrder, { isLoading: isLoadingCancel }] =
    useCancelOrderMutation();

  const onAcceptOrder = async () => {
    try {
      await acceptOrder(order?.id).unwrap();
      // notification.success({
      //   message: "Xác nhận đơn hàng",
      //   description: (
      //     <p>
      //       Đơn hàng tại{" "}
      //       <span className="font-bold">
      //         {order?.floor?.name} - {order?.table?.name}
      //       </span>{" "}
      //       đã được xác nhận thành công!
      //     </p>
      //   ),
      //   placement: "bottomRight",
      // });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const onRefuseOrder = async () => {
    try {
      await refuseOrder(order?.id).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelOrder = async (data) => {
    try {
      await cancelOrder({ orderId: order?.id, reason: data.reason }).unwrap();
      hideModal();
      refetch();
    } catch (error) {
      notification.error({
        message: "Huỷ đơn hàng thất bại",
        description: <p>{error?.data?.title}</p>,
        placement: "bottomRight",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 mt-8 text-xl font-bold">Chi tiết đơn</h2>
      {order?.status === "CREATED" && (
        <div className="self-end">
          <Button danger ghost onClick={showModal}>
            Huỷ đơn
          </Button>
          <Modal
            title="Huỷ đơn"
            open={open}
            centered
            okText="Xác nhận"
            okButtonProps={{ danger: true }}
            cancelText="Đóng"
            onCancel={hideModal}
            confirmLoading={isLoadingCancel}
            onOk={form.submit}
            destroyOnClose
          >
            <p>Bạn có chắc chắn muốn huỷ đơn bàn này không?</p>
            <Form form={form} autoComplete="off" onFinish={onCancelOrder}>
              <Form.Item name="reason">
                <TextArea
                  rows={4}
                  className="mt-2"
                  placeholder="Lý do huỷ đơn"
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}

      <div className="self-end">
        <a
          className="flex items-center gap-1 text-base underline"
          onClick={() => setOpenHistory(true)}
        >
          <AiOutlineHistory size={20} />
          Lịch sử đơn bàn
        </a>
        <HistoryOrder
          open={openHistory}
          setOpen={setOpenHistory}
          order={order}
        />
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-200 py-4">
        <p className="text-base font-normal">Mã hoá đơn:</p>
        {isLoading ? (
          <Skeleton.Input active={true} />
        ) : (
          <p className="font-bold text-black1">{order?.code}</p>
        )}
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-200 py-4">
        <p className="text-base font-normal">Nhân viên:</p>
        {isLoading ? (
          <Skeleton.Input active={true} />
        ) : (
          <p className="font-bold text-black1">
            {
              order?.logChanges?.find((x) => x.action === "CREATED")?.user
                ?.fullName
            }
          </p>
        )}
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-200 py-4">
        <p className="text-base font-normal">Vị trí:</p>
        {isLoading ? (
          <Skeleton.Input active={true} />
        ) : (
          <p className="rounded-md bg-[#5A5656] px-2 py-1 font-bold text-white">
            {order?.floor?.name} - {order?.table?.name}
          </p>
        )}
      </div>

      <div className="flex w-full items-center justify-between py-4">
        <p className="text-base font-normal">Trạng thái:</p>
        {isLoading ? (
          <Skeleton.Input active={true} />
        ) : (
          <div
            className={classNames(
              listStatus[order?.status]?.color,
              listStatus[order?.status]?.bgColor,
              "inline-flex w-28 items-center justify-center rounded-xl px-2 py-1 text-sm"
            )}
          >
            {listStatus[order?.status]?.text}
          </div>
        )}
      </div>

      <div className="mt-1 w-full rounded-lg bg-white p-4 shadow ring-1 ring-gray-200">
        <Spin
          tip="Đang tải"
          size="small"
          className="w-full"
          spinning={isLoading}
        >
          <div className="divide-y divide-gray-100">
            <div className="flex w-full items-center pb-1 text-sm sm:text-base">
              <p className="w-3/5">Tên món</p>
              <p className="w-1/5 text-center">SL</p>
              <p className="w-1/4 whitespace-nowrap text-right sm:w-1/5">
                Thành tiền
              </p>
            </div>
            {order?.foods.map((food, index) => (
              <div className="py-3" key={`f-${index}`}>
                <div className="flex w-full items-center text-sm text-black1 sm:text-base">
                  <p className="w-3/5">{food.name}</p>
                  <p className="w-1/5 text-center">{food.quantity}</p>
                  <p className="w-1/4 whitespace-nowrap text-right sm:w-1/5">
                    {formatMoney(
                      (food.price + getTotalPrice(food.options)) * food.quantity
                    )}
                    đ
                  </p>
                </div>
                {food.options && food.options.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    + {food.options.map((option) => option.name).join(", ")}
                  </div>
                )}
                {food.note && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlinePencilSquare className="mb-[2px]" />
                    {food.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Spin>
        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-4 text-base font-bold">
          <p>Tổng tiền</p>
          {isLoading ? (
            <Skeleton.Input active={true} />
          ) : (
            <p>{formatMoney(order?.totalPrice)}đ</p>
          )}
        </div>
        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-4 text-base font-bold">
          <p>Chiết khấu</p>
          {isLoading ? (
            <Skeleton.Input active={true} />
          ) : (
            <p className="text-red-500">
              {formatMoney(
                order?.discountType === "PERCENT"
                  ? (order?.totalPrice * order?.discount || 0) / 100
                  : order?.discount || 0
              )}
              đ
            </p>
          )}
        </div>
        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-4 text-base font-bold">
          <p>Phụ thu</p>
          {isLoading ? (
            <Skeleton.Input active={true} />
          ) : (
            <p className="text-primary">
              {formatMoney(
                order?.surchargeType === "PERCENT"
                  ? (order?.totalPrice * order?.surcharge || 0) / 100
                  : order?.surcharge || 0
              )}
              đ
            </p>
          )}
        </div>
        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold">
          <p>Thành tiền</p>
          {isLoading ? (
            <Skeleton.Input active={true} />
          ) : (
            <p>{formatMoney(order?.totalNetPrice)}đ</p>
          )}
        </div>
      </div>

      <div className="mb-2 mt-6 flex w-full items-center gap-2">
        <Button size="large" block onClick={handleClose}>
          Đóng
        </Button>
        {order?.status === "WAITING" && (
          <>
            <Button
              type="primary"
              danger
              block
              size="large"
              onClick={onRefuseOrder}
              loading={isLoadingRefuse}
            >
              Từ chối
            </Button>
            <Button
              type="primary"
              block
              size="large"
              onClick={onAcceptOrder}
              loading={isLoadingAccept}
            >
              Chấp nhận
            </Button>
          </>
        )}

        {(order?.status === "CREATED" || order?.status === "COMPLETED") && (
          <>
            <Button
              block
              size="large"
              className="border hover:bg-indigo-500 hover:text-white border-indigo-500 text-indigo-500"
              onClick={() =>
                navigate(`/order/edit`, {
                  state: {
                    orderId: order.id,
                    tableId: order?.table?.id,
                    tableName: order?.table?.name,
                    floorId: order?.floor?.id,
                    floorName: order?.floor?.name,
                  },
                })
              }
            >
              Sửa đơn
            </Button>
          </>
        )}
        {/* <UpdateOrder orderFoods={order?.foods} orderId={order?.id}/> */}
      </div>
    </div>
  );
};

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

const StepPayment = ({ order, setStep, handleClose, hasUpdate }) => {
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState("");
  const [paymentType, setPaymentType] = useState("CASH");
  const [loading, setLoading] = useState(true);

  const [payOrder, { isLoading: isLoadingPayment }] = usePayOrderMutation();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (hasUpdate) {
      setStep((prev) => prev - 1);
    }
  }, [hasUpdate]);

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

  const onPayment = async (type) => {
    try {
      const response = await payOrder({
        orderId: order?.id,
        paymentType: type ? type : paymentType,
      }).unwrap();
      handleClose();
      return response;
    } catch (error) {
      notification.error({
        message: "Thanh toán thất bại",
        description: (
          <p>
            <span className="font-semibold">{error?.data?.title}</span>{" "}
          </p>
        ),
        placement: "bottomRight",
      });
      return error;
    }
  };

  const onPaymentAndPrint = async () => {
    const response = await onPayment();
    if (response?.status !== 400) {
      handlePrint();
    }
  };

  return (
    <div className="flex-1 space-y-3 rounded-xl">
      <h2 className="mb-4 mt-8 text-center text-xl font-bold">Thanh toán</h2>
      <div className="flex items-center justify-between text-base">
        <p>Thành tiền</p>
        <p>{formatMoney(order?.totalNetPrice)} đ</p>
      </div>
      <div className="flex items-center justify-between border-b border-dashed pb-4 text-base">
        <p>Khuyến mãi</p>
        <p>Không có</p>
      </div>

      <div className="flex items-center justify-between text-base">
        <p>Tổng hoá đơn</p>
        <p className="text-lg font-semibold">
          {formatMoney(order?.totalNetPrice)} đ
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
                    <p>Đang tải...</p>
                  </div>
                </Skeleton.Node>
              ) : (
                <div className="mt-4 flex items-center justify-center">
                  {qrCode && <QRCode value={qrCode} size={250} />}
                  {/* <img
                    src={qrCode}
                    alt="qr-code"
                    className="h-[250px] w-[250px] shadow-md"
                  /> */}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mb-2 mt-2 flex w-full flex-wrap items-center gap-2">
          <Button
            size="large"
            className="flex-1"
            onClick={onPaymentAndPrint}
            loading={isLoadingPayment}
          >
            Thanh toán và in hoá đơn
          </Button>

          <Button
            type="primary"
            size="large"
            className="flex-1"
            onClick={onPayment}
            loading={isLoadingPayment}
          >
            Xác nhận
          </Button>
          <Button
            size="large"
            className="flex-1 border-none bg-orange-500 text-white hover:bg-orange-400"
            onClick={() => onPayment("QR_STATIC")}
            loading={isLoadingPayment}
          >
            {t("Đã thanh toán qua QR tĩnh")}
          </Button>
        </div>

        <ContentPrint
          componentRef={componentRef}
          order={order}
          qrCode={qrCode}
        />
      </div>
    </div>
  );
};

const OrderDetail = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tableId = location.state && location.state.tableId;
  const { hasUpdate } = useSelector((state) => state.cart);

  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);

  const {
    data: order,
    isLoading,
    refetch,
  } = tableId
    ? useGetOrderByTableQuery(
        {
          tableId,
          sortBy: "id",
          direction: "DESC",
        },
        { refetchOnMountOrArgChange: true }
      )
    : useGetOrderDetailChangeQuery(orderId ? orderId : skipToken, {
        refetchOnMountOrArgChange: true,
      });

  useEffect(() => {
    if (order) {
      setOpen(true);
    }
  }, [order]);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    if (hasUpdate) {
      refetch();
    }
  }, [hasUpdate]);

  const modalContent = () => {
    switch (step) {
      case 0:
        return (
          <StepDetail
            order={order}
            isLoading={isLoading}
            handleClose={handleClose}
            t={t}
            setStep={setStep}
            refetch={refetch}
            navigate={navigate}
            location={location}
          />
        );

      case 1:
        return (
          <StepPayment
            order={order}
            setStep={setStep}
            handleClose={handleClose}
            hasUpdate={hasUpdate}
          />
        );

      default:
        break;
    }
  };

  return (
    <Modal open={open} onCancel={handleClose} footer={null} destroyOnClose>
      {modalContent()}
    </Modal>
  );
};

export default OrderDetail;
