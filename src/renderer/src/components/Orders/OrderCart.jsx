import React, { useEffect, useState } from "react";
import {
  Collapse,
  Empty,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Space,
} from "antd";
import Scrollbars from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import { InputNote } from "..";
import { createQrCode } from "@/api";
import { calculateTotalMoney } from "@/features/cart/cartSlice";
import { classNames, formatMoney } from "@/utils/common";
import ButtonChangeQuantity from "../ButtonChangeQuantity";
import dayjs from "dayjs";
import { BsStopwatch } from "react-icons/bs";
import { useStopFoodOrderMutation } from "@/api/orderApiSlice";
const { Panel } = Collapse;

const OrderCart = (props) => {
  const [paymentType, setPaymentType] = useState("CASH");
  const { orderFoods } = useSelector((state) => state.cart);
  const totalMoney = useSelector(calculateTotalMoney);

  const getTotalPrice = (list = []) => {
    return list?.reduce((price, item) => item.price + price, 0);
  };

  const [clock, setClock] = useState(dayjs());
  const [stop, setStop] = useState(false);
  const [stopFood, { isLoading: isLoadingStopFood }] =
    useStopFoodOrderMutation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setClock(dayjs());
    }, [1000]);

    if (stop) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [stop]);

  const onStopFood = async (foodId) => {
    const bodyData = {
      dateTime: dayjs().format(),
      orderId: props?.order?.id,
      foodIndexes: [foodId],
    };
    try {
      await stopFood(bodyData).unwrap();
      props.refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const getTime = (time, endTime) => {
    const dateNow = dayjs(clock);
    const dateOrder = dayjs(time);
    const subtractTime = endTime
      ? endTime.diff(dateOrder)
      : dateNow.diff(dateOrder);
    return dayjs.duration(subtractTime).format("HH:mm:ss");
  };

  useEffect(() => {
    if (!props?.order?.code) return;
    const createQr = async () => {
      try {
        const response = await createQrCode({
          orderCode: props?.order.code,
          notice: "Thanh toan",
        });
        var reader = new window.FileReader();
        // reader.readAsDataURL(response.data);
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

    if (paymentType === "QR_CODE") createQr();
  }, [props?.order?.code, paymentType]);

  return (
    <div className="mt-4 flex flex-1 flex-col">
      {orderFoods?.length > 0 ? (
        <Scrollbars
          // style={{ height: "calc(100vh - 580px)" }}
          style={{ flex: 1 }}
          className="rounded-lg border border-gray-200"
        >
          <div className="divide-y divide-gray-200 px-4">
            {orderFoods?.map((food, index) => (
              <div
                className={classNames(
                  food.status === "COMPLETED" && food.needProcessing || food?.billingTime?.endTime
                    ? "pointer-events-none opacity-70"
                    : "opacity-100",
                  "py-3"
                )}
                key={`f-${index}`}
              >
                <div className="flex w-full cursor-pointer flex-wrap items-center text-sm text-black1 sm:text-base">
                  <p
                    className={`${
                      index === 0 ? "text-primary" : ""
                    } w-full pr-2 hover:text-primary sm:w-2/4`}
                    onClick={() => props.setSelectedFood(food)}
                  >
                    {food.name}
                  </p>
                  <div className="sm:order-0 order-1 my-1 w-1/2 pr-3 text-center sm:w-1/4 md:pr-0">
                    <ButtonChangeQuantity food={food} />
                  </div>
                  <p className="my-1 w-1/2 whitespace-nowrap pr-4 text-left sm:order-1 sm:w-1/4 sm:text-right md:w-1/4">
                    {formatMoney(
                      (food.price + getTotalPrice(food.options ? food.options.flat(1) : [])) *
                        food.quantity
                    )}
                    đ
                  </p>
                </div>
                {food.options && food.options.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    +{" "}
                    {food.options
                      .flat(1)
                      .map((option) => option.name)
                      .join(", ")}
                  </div>
                )}
                {food.note && (
                  <p className="mt-1 text-sm text-gray-500">
                    Ghi chú: {food.note}
                  </p>
                )}
                {food?.tbillingTime &&
                  (!food?.billingTime.endTime ? (
                    <p className="flex items-center text-sm text-blue-500">
                      {getTime(food?.billingTime?.startTime)}{" "}
                      {food?.billingTime?.startTime && (
                        <Popconfirm
                          title="Bạn có chắc chắn muốn dừng món ăn này?"
                          overlayStyle={{ width: "310px" }}
                          placement="bottom"
                          okText="Xác nhận"
                          cancelText="Hủy"
                          onConfirm={() => onStopFood(food.index)}
                          okButtonProps={{ loading: isLoadingStopFood }}
                        >
                          <span
                            className="ml-2 inline-flex cursor-pointer items-center gap-1 text-red-500 hover:underline"
                          >
                            <BsStopwatch /> Dừng món
                          </span>
                        </Popconfirm>
                      )}
                    </p>
                  ) : (
                    <p className="flex items-center text-sm text-red-500">
                      {getTime(
                        food?.billingTime.startTime,
                        dayjs(food?.billingTime.endTime)
                      )}{" "}
                      (Đã dừng)
                    </p>
                  ))}
                {/* <InputNote food={food} /> */}
              </div>
            ))}
          </div>
        </Scrollbars>
      ) : (
        <div className="flex-1 divide-y divide-gray-200 rounded-lg border border-gray-200 p-4">
          <Empty />
        </div>
      )}

      <Collapse className="mt-2">
        <Panel header="Chiết khấu, phụ thu" key="1">
          {/* <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <div className="w-full sm:w-1/2">
                <div className="mb-1 flex items-center gap-2">
                  <p>Chiết khấu</p>
                  <Radio.Group
                    onChange={props.onChangeDiscountType}
                    value={props.discountType}
                  >
                    <Radio value="PERCENT">Theo %</Radio>
                    <Radio value="CASH">Theo giá trị</Radio>
                  </Radio.Group>
                </div>
                <InputNumber
                  className="w-full"
                  addonAfter={props.discountType === "PERCENT" ? "%" : "đ"}
                  controls={false}
                  value={props.discount}
                  onChange={props.onChangeDiscount}
                  min={0}
                  max={props.discountType === "PERCENT" ? 100 : totalMoney}
                  placeholder="Nhập giá trị"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <p className="mb-1">Lý do</p>
                <Input
                  className="w-full"
                  value={props.discountNote}
                  onChange={props.onChangeDiscountNote}
                  placeholder="Nhập lý do"
                />
              </div>
            </div> */}

          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <div className="w-full sm:w-1/2">
              <Space.Compact>
                <Select
                  defaultValue="PERCENT"
                  value={props.discountType}
                  onChange={props.onChangeDiscountType}
                  style={{ width: 180 }}
                  options={[
                    { value: "PERCENT", label: "Chiết khấu theo %" },
                    { value: "CASH", label: "Chiết khấu theo giá trị" },
                  ]}
                />
                <div className="flex-1">
                  <InputNumber
                    controls={false}
                    addonAfter={props.discountType === "PERCENT" ? "%" : "đ"}
                    value={props.discount}
                    onChange={props.onChangeDiscount}
                    min={0}
                    max={props.discountType === "PERCENT" ? 100 : undefined}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    placeholder="Nhập giá trị"
                  />
                </div>
              </Space.Compact>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-1/2">
              <p className="whitespace-nowrap">Lý do</p>
              <Input
                value={props.discountNote}
                onChange={props.onChangeDiscountNote}
                placeholder="Nhập lý do"
              />
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <div className="w-full sm:w-1/2">
              <Space.Compact>
                <Select
                  defaultValue="PERCENT"
                  value={props.surchargeType}
                  onChange={props.onChangeSurchargeType}
                  style={{ width: 180 }}
                  options={[
                    { value: "PERCENT", label: "Phụ thu theo %" },
                    { value: "CASH", label: "Phụ thu theo giá trị" },
                  ]}
                />
                <div className="flex-1">
                  <InputNumber
                    controls={false}
                    addonAfter={props.surchargeType === "PERCENT" ? "%" : "đ"}
                    value={props.surcharge}
                    onChange={props.onChangeSurcharge}
                    min={0}
                    max={props.surchargeType === "PERCENT" ? 100 : undefined}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    placeholder="Nhập giá trị"
                  />
                </div>
              </Space.Compact>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-1/2">
              <p className="whitespace-nowrap">Lý do</p>
              <Input
                value={props.surchargeNote}
                onChange={props.onChangeSurchargeNote}
                placeholder="Nhập lý do"
              />
            </div>
          </div>
        </Panel>
      </Collapse>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p>Tổng hoá đơn</p>
          <p>{formatMoney(totalMoney)}đ</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Chiết khấu:</p>
          <p className="text-red-500">
            {props.discount > 0 ? "-" : ""}
            {formatMoney(
              props.discountType === "PERCENT"
                ? (totalMoney * props.discount) / 100
                : props.discount
            )}
            đ
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p>Phụ thu</p>
          <p className="text-primary">
            {props.surcharge > 0 ? "+" : ""}
            {formatMoney(
              props.surchargeType === "PERCENT"
                ? (totalMoney * props.surcharge) / 100
                : props.surcharge
            )}
            đ
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p>Khuyến mãi</p>
          <p>Không có</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Thành tiền</p>
          <p>
            {formatMoney(
              totalMoney -
                (props.discountType === "PERCENT" && props.discount > 0
                  ? (totalMoney * props.discount) / 100
                  : props.discount) +
                (props.surchargeType === "PERCENT" && props.surcharge > 0
                  ? (totalMoney * props.surcharge) / 100
                  : props.surcharge)
            )}
            đ
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCart;
