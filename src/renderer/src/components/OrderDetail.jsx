import { Button, Modal, Segmented, Skeleton, message, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByTableQuery, usePayOrderMutation } from "../api/orderApiSlice";
import { formatMoney } from "../utils/common";
import { AiOutlineQrcode } from "react-icons/ai";
import { BsCash } from "react-icons/bs";
import { createQrCode } from "../api";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const OrderDetail = ({ currentTable, setCurrentTable }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [qrCode, setQrCode] = useState("");
  const [paymentType, setPaymentType] = useState("QR_CODE");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "20%",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (text) => formatMoney(text) + "đ",
      align: "right",
      width: "20%",
    },
  ];

  const { data } = useGetOrderByTableQuery({
    tableId: currentTable,
    sortBy: "id",
    direction: "DESC",
  });

  const [payOrder, { isLoading: isLoadingPayment }] = usePayOrderMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentTable(null);
  };

  useEffect(() => {
    showModal();
  }, [currentTable]);

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

  const onPayment = async () => {
    try {
      const response = await payOrder({
        orderId: data?.id,
        paymentType,
      }).unwrap();
      message.success({
        type: "success",
        content: "Thanh toán thành công!",
      });
      handleCancel();
      return response;
    } catch (error) {
      // message.error({
      //   type: "error",
      //   content: error?.data?.title,
      // });
      handleCancel();
    }
  };

  const onPaymentAndPrint = async () => {
    const response = await onPayment();
    if (response.data) {
      setOrder(response.data);
    }
  };

  useEffect(() => {
    if (order) {
      handlePrint();
      handleCancel();
    }
  }, [order]);

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      className=""
      width="70%"
    >
      <div className="mt-8 flex w-full gap-6 pb-1">
        <div className="flex-1">
          <h4 className="text-center text-xl font-bold">Hoá đơn tạm tính</h4>
          <div>
            <div className="mt-8 flex items-center justify-between border-b border-gray-200 pb-4">
              <p className="text-base">Tên món</p>
              <p className="text-base">Đơn giá</p>
            </div>
          </div>

          <div className="my-4 space-y-3">
            {data?.foods.map((item) => (
              <div className="flex items-center justify-between" key={item.id}>
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt="food"
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                  <p className="text-base font-medium">
                    {item.name} (x{item.quantity})
                  </p>
                </div>
                <p className="text-base font-medium">
                  {formatMoney(item.price)} đ
                </p>
              </div>
            ))}
          </div>

              <div className="hidden">
          <div ref={componentRef} className="w-full flex-col p-6">
            <h3 className="text-center text-xl font-medium">
              {user.company.companyName}
            </h3>
            <p className="text-center">Địa chỉ:</p>

            <h4 className="my-6 text-center text-xl">
              HOÁ ĐƠN THANH TOÁN <br /> (FINAL CHECK)
            </h4>

            <div className="border-b border-dotted border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <p>Mã đơn hàng: {order?.code}</p>
                <p>{order?.table?.name}</p>
              </div>
              <p>Giờ in: {dayjs().format("HH:mm DD/MM/YYYY")}</p>
              <p>Nhân viên:</p>
            </div>
            <Table
              dataSource={order?.foods}
              columns={columns}
              pagination={false}
              footer={() => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Thành tiền</p>
                    <p>{formatMoney(order?.totalNetPrice)}đ</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Khuyến mãi</p>
                    <p>Không có</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Tổng tiền</p>
                    <p>{formatMoney(order?.totalNetPrice)}đ</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Hình thức thanh toán</p>
                    <p>
                      {order?.paymentType === "CASH" ? "Tiền mặt" : "Mã QR"}
                    </p>
                  </div>
                </div>
              )}
            />

            <p className="mt-4 text-center font-medium">
              Cảm ơn quý khách và hẹn gặp lại! <br />
              Thank you and see you again!
            </p>
          </div>
          </div>
        </div>
        <div className="flex-1 space-y-3 rounded-xl bg-primary px-6 pt-8 pb-8">
          <div className="flex items-center justify-between text-base text-white">
            <p>Thành tiền</p>
            <p>{formatMoney(data?.totalNetPrice)} đ</p>
          </div>
          <div className="flex items-center justify-between border-b border-dashed pb-4 text-base text-white">
            <p>Khuyến mãi</p>
            <p>Không có</p>
          </div>

          <div className="flex items-center justify-between text-base text-white">
            <p>Tổng hoá đơn</p>
            <p className="text-lg font-semibold">
              {formatMoney(data?.totalNetPrice)} đ
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
                      <img
                        src={qrCode}
                        alt="qr-code"
                        className="h-[250px] w-[250px] shadow-md"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <Button
              type="primary"
              className="h-[50px] w-full bg-white text-base font-bold text-primary"
              onClick={onPayment}
            >
              Thanh toán
            </Button>

            <Button
              type="primary"
              className="mt-4 h-[50px] w-full bg-white text-base font-bold text-primary"
              onClick={onPaymentAndPrint}
            >
              Thanh toán và in hoá đơn
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetail;
