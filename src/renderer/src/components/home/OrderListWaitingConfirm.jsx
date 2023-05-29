import { useTranslation } from "react-i18next";
import { EffectCoverflow, Pagination } from "swiper";
import { Button, Collapse, Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import dayjs from 'dayjs';
import { IoNotificationsOutline } from "react-icons/io5";
import { formatMoney, getTotal } from "@/utils/common";
import {
  useAcceptOrderMutation,
  useRefuseOrderMutation,
} from "@/api/orderApiSlice";

const { Panel } = Collapse;

const OrderListWaitingConfirm = ({ orders, isLoadingOrders, isFetchingOrders }) => {
  const { t } = useTranslation();

  const [acceptOrder, { isLoading: isLoadingAccept }] =
    useAcceptOrderMutation();

  const [refuseOrder, { isLoading: isLoadingRefuse }] =
    useRefuseOrderMutation();

  const onAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const onRefuseOrder = async (orderId) => {
    try {
      await refuseOrder(orderId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Collapse
      expandIconPosition="end"
      className="relative mb-4 bg-white shadow-md shadow-orange-100 custom-collapse"
      bordered={false}
    >
      <div className="absolute left-0 top-0 h-full w-[10px] rounded-l-[8px] bg-orange-500"></div>
      <Panel
        header={
          <div className="ml-2 flex items-center gap-3">
            <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-orange-500">
              <IoNotificationsOutline
                size={13}
                color="white"
                className="animate-swing"
              />
            </div>
            <p className="text-base text-orange-400">
              Bạn có {orders?.length} đơn hàng cần xác nhận!
            </p>
          </div>
        }
        key="1"
      >
        <Spin spinning={isLoadingOrders || isFetchingOrders}>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: true,
            }}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
          >
            {orders?.map((order) => (
              <SwiperSlide key={order.id}>
                <div className="relative w-full space-y-2 rounded-lg border border-gray-200 bg-white p-3 text-[#999] shadow-md sm:p-6">
                  <div className="flex items-center justify-between gap-1">
                    <div className="rounded-md bg-gray-500 py-1 px-2 text-white">
                      {order?.floor?.name} - {order?.table?.name}
                    </div>
                    <p className="text-orange-500">{t("waiting")}</p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div>Mã đơn hàng:</div>
                    <p>{order?.code}</p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div>Ngày tạo:</div>
                    <p>
                      {dayjs(order?.logs?.[0]?.actionDatetime).format(
                        "HH:mm DD/MM/YYYY"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div>Tổng số món:</div>
                    <p>{getTotal(order?.foods)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div>Tổng tiền:</div>
                    <p>{formatMoney(order?.totalNetPrice)}đ</p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                      danger
                      className="flex-1"
                      loading={isLoadingRefuse}
                      onClick={() => onRefuseOrder(order?.id)}
                    >
                      Từ chối
                    </Button>
                    <Button
                      type="primary"
                      className="flex-1"
                      loading={isLoadingAccept}
                      onClick={() => onAcceptOrder(order?.id)}
                    >
                      Xác nhận
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Spin>
      </Panel>
    </Collapse>
  );
};

export default OrderListWaitingConfirm;
