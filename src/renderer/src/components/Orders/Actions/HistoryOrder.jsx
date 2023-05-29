import { Modal, Timeline } from "antd";
import dayjs from "dayjs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { sortBy } from "lodash";
import { useEffect, useState } from "react";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
import icons from "../../../constants/icons";
import { formatMoney } from "../../../utils/common";
import _ from "lodash";

const actionName = {
  WAITING: { label: "Đơn được tạo từ iMenu", color: "brown" },
  CREATED: { label: "đã tạo đơn bàn", color: "blue" },
  CHANGE_FOOD: { label: "đã thay đổi món ăn", color: "orange" },
  COMPLETED: { label: "đã hoàn thành", color: "green" },
  CANCELLED: { label: "đã huỷ đơn bàn", color: "red" },
  COOKER_COMPLETED_FOOD: { label: "đã hoàn thành món ăn", color: "pink" },
  CHANGE_DISCOUNT: { label: "đã thay đổi phụ thu, chiết khấu", color: "cyan" },
  CREATED_QR: { label: "đã tạo mã QR thanh toán", color: "violet" },
  CHANGE_FOOD_DISCOUNT: {
    label: "đã thay đổi món ăn, phụ thu và chiết khấu",
    color: "brown",
  },
};

const HistoryOrder = ({ open, setOpen, order }) => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (order) {
      const changeFoodList = order?.logChanges?.filter(
        (x) => x.action === "CHANGE_FOOD" || x.action === "CHANGE_FOOD_DISCOUNT"
      );

      const changeDiscount = order?.logChanges?.filter(
        (x) =>
          x.action === "CHANGE_DISCOUNT" || x.action === "CHANGE_FOOD_DISCOUNT"
      );

      const transformDiscount = changeDiscount.map((item, index) => {
        if (changeDiscount[index + 1]) {
          const objectDiscount = {
            ...item,
            action: "CHANGE_DISCOUNT",
            newLogOrder: changeDiscount[index + 1]?.logOrder,
          };
          return objectDiscount;
        } else {
          const objectDiscount = {
            ...item,
            action: "CHANGE_DISCOUNT",
            newLogOrder: {
              discountType: order.discountType,
              surchargeType: order.surchargeType,
              discount: order.discount,
              discountNote: order.discountNote,
              surcharge: order.surcharge,
              surchargeNote: order.surchargeNote,
            },
          };
          return objectDiscount;
        }
      });

      const transform = changeFoodList.map((item, index) => {
        if (changeFoodList[index + 1]) {
          const objectFoods2 = {
            ...item,
            newFoods: changeFoodList[index + 1]?.oldFoods,
          };

          let list1 = [];

          objectFoods2.newFoods.map((f) => {
            const findDup = objectFoods2.oldFoods.find(
              (ff) =>
                ff.id === f.id &&
                ff.quantity !== f.quantity &&
                ff?.index === f?.index
            );
            if (findDup) {
              const test = { ...findDup, newQuantity: f.quantity };
              list1.push(test);
            }
          });

          const newFoods = objectFoods2.newFoods.filter(function (cv) {
            return !objectFoods2.oldFoods.find(function (e) {
              return e.id === cv.id && e?.index === cv?.index;
            });
          });

          const deletedFoods = objectFoods2.oldFoods.filter(function (cv) {
            return !objectFoods2.newFoods.find(function (e) {
              return e.id === cv.id && e?.index === cv?.index;
            });
          });

          return {
            action: "CHANGE_FOOD",
            actionDatetime: objectFoods2.actionDatetime,
            newFoods,
            deletedFoods,
            editFoods: list1,
            user: objectFoods2.user,
          };
        } else {
          const objectFoods2 = {
            ...item,
            newFoods: [...order.foods],
          };

          let list1 = [];

          objectFoods2.newFoods.map((f) => {
            const findDup = objectFoods2.oldFoods.find(
              (ff) =>
                ff.id === f.id &&
                ff.quantity !== f.quantity &&
                ff?.index === f?.index
            );
            if (findDup) {
              const test = { ...findDup, newQuantity: f.quantity };
              list1.push(test);
            }
          });

          const newFoods = objectFoods2.newFoods.filter(function (cv) {
            return !objectFoods2.oldFoods.find(function (e) {
              return e.id === cv.id && e?.index === cv?.index;
            });
          });

          const deletedFoods = objectFoods2.oldFoods.filter(function (cv) {
            return !objectFoods2.newFoods.find(function (e) {
              return e.id === cv.id && e?.index === cv?.index;
            });
          });

          return {
            action: "CHANGE_FOOD",
            actionDatetime: objectFoods2.actionDatetime,
            newFoods,
            editFoods: list1,
            deletedFoods,
            user: objectFoods2.user,
          };
        }
      });

      const removeChangeFood = order?.logChanges?.filter(
        (x) => x.action !== "CHANGE_FOOD" && x.action !== "CHANGE_DISCOUNT"
      );
      const mergeArray = [
        ...removeChangeFood,
        ...transform,
        ...transformDiscount,
      ];
      const sortByTime = sortBy(mergeArray, ["actionDatetime"]);

      setOrderData(sortByTime);
    }
  }, [order]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      destroyOnClose
      footer={null}
      title="Lịch sử đơn bàn"
      width={700}
      bodyStyle={{ padding: 0 }}
    >
      {orderData && (
        <Timeline
          className="mt-6"
          items={orderData
            .filter((x) => x.action !== "CHANGE_FOOD_DISCOUNT")
            .map((log, logIdx) => ({
              color: actionName[log.action]?.color,
              children: (
                <div>
                  <div className="flex items-center justify-between">
                    <p>
                      <span className="font-semibold">
                        {log?.user?.fullName}
                      </span>{" "}
                      {actionName[log.action]?.label}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {dayjs(log.actionDatetime).format("HH:mm - DD/MM/YYYY")}
                    </p>
                  </div>
                  {log.action === "CHANGE_FOOD" && (
                    <div className="mt-2 rounded-lg border-[1px] bg-gray-50">
                      {/* Thêm món */}
                      {log?.newFoods && log?.newFoods?.length > 0 && (
                        <div className="bg-green-50 p-3">
                          <div className="mb-1 inline-flex items-center gap-1">
                            <img
                              src={icons.iconAdd}
                              alt=""
                              className="h-3 w-3"
                            />
                            <h4 className="font-semibold text-black1">
                              Thêm món
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {log?.newFoods.map((food, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                              >
                                <div className="flex flex-1 items-center gap-2">
                                  <img
                                    src={food.image}
                                    alt="food"
                                    className="h-8 w-8 rounded-md border border-gray-200 object-cover p-1"
                                  />
                                  <div>
                                    <p className="text-sm text-black1">
                                      {food.name}
                                    </p>
                                    <p className="text-sm text-black1">
                                      Số lượng: {food.quantity}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sửa món */}
                      {log?.editFoods && log?.editFoods?.length > 0 && (
                        <div className="bg-orange-50 p-3">
                          <div className="mb-1 flex items-center gap-1">
                            <img
                              src={icons.iconEdit}
                              alt=""
                              className="h-3 w-3"
                            />
                            <h4 className="font-semibold text-black1">
                              Sửa món
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {log?.editFoods.map((food, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                              >
                                <div className="flex flex-1 items-center gap-2">
                                  <img
                                    src={food.image}
                                    alt="food"
                                    className="h-8 w-8 rounded-md border border-gray-200 object-cover p-1"
                                  />
                                  <div>
                                    <p className="text-sm text-black1">
                                      {food.name}
                                    </p>
                                    <p className="text-sm text-black1">
                                      Số lượng: {food.quantity}
                                    </p>
                                  </div>
                                </div>

                                <div className="w-1/10 flex items-center justify-center">
                                  <AiOutlineArrowRight color="gray" />
                                </div>

                                <div className="flex flex-1 items-center gap-2">
                                  <img
                                    src={food.image}
                                    alt="food"
                                    className="h-8 w-8 rounded-md border border-gray-200 object-cover p-1"
                                  />
                                  <div>
                                    <p className="text-sm text-black1">
                                      {food.name}
                                    </p>
                                    <div className="flex gap-1 text-sm text-black1">
                                      <p>Số lượng: </p>
                                      <p>
                                        {food.newQuantity}{" "}
                                        <span
                                          className={
                                            food.newQuantity < food.quantity
                                              ? "text-red-500"
                                              : "text-primary"
                                          }
                                        >
                                          (
                                          {food.newQuantity < food.quantity
                                            ? food.newQuantity - food.quantity
                                            : `+${Number(
                                                food.newQuantity - food.quantity
                                              )}`}
                                          )
                                        </span>
                                      </p>
                                      {food.newQuantity > food.quantity ? (
                                        <BsArrowUpShort
                                          size={21}
                                          color="#2DB894"
                                        />
                                      ) : (
                                        <BsArrowDownShort
                                          size={21}
                                          color="red"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Xoá món */}
                      {log?.deletedFoods && log?.deletedFoods?.length > 0 && (
                        <div className="bg-red-50 p-3">
                          <div className="mb-1 flex items-center gap-1">
                            <img
                              src={icons.iconDelete}
                              alt=""
                              className="h-3 w-3"
                            />
                            <h4 className="font-semibold text-black1">
                              Xóa món
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {log?.deletedFoods.map((food, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                              >
                                <div className="flex flex-1 items-center gap-2">
                                  <img
                                    src={food.image}
                                    alt="food"
                                    className="h-8 w-8 rounded-md border border-gray-200 object-cover p-1"
                                  />
                                  <div>
                                    <p className="text-sm text-black1">
                                      {food.name}
                                    </p>
                                    <p className="text-sm text-black1">
                                      Số lượng: {food.quantity}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chiết khấu & Phụ thu */}
                  {log.action === "CHANGE_DISCOUNT" && (
                    <div className="mt-2 rounded-lg border-[1px] bg-cyan-50 p-3">
                      <div className="space-y-2">
                        {/* Chiết khấu */}
                        {(log?.logOrder?.discount !==
                          log?.newLogOrder?.discount ||
                          log?.logOrder?.discountType !==
                            log?.newLogOrder?.discountType ||
                          log?.logOrder?.discountNote !==
                            log?.newLogOrder?.discountNote) && (
                          <div>
                            <div className="flex items-center gap-1">
                              <img
                                src={icons.iconDiscount}
                                alt=""
                                className="h-3 w-3"
                              />
                              <p className="font-medium">Chiết khấu</p>
                            </div>
                            {log?.logOrder?.discount !==
                              log?.newLogOrder?.discount && (
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  {log?.logOrder?.discountType !==
                                    log?.newLogOrder?.discountType && (
                                    <p className="text-sm text-black1">
                                      Loại:{" "}
                                      {log?.logOrder?.discountType === "PERCENT"
                                        ? "Theo %"
                                        : "Theo giá trị"}
                                    </p>
                                  )}
                                  {log?.logOrder?.discount !==
                                    log?.newLogOrder?.discount && (
                                    <p className="text-sm text-black1">
                                      Tỷ lệ:{" "}
                                      {formatMoney(log?.logOrder?.discount)}
                                      {log?.logOrder?.discountType === "PERCENT"
                                        ? "%"
                                        : "đ"}
                                    </p>
                                  )}
                                </div>

                                <div className="w-1/10 flex items-center justify-center">
                                  <AiOutlineArrowRight color="gray" />
                                </div>

                                <div className="flex flex-1 items-center gap-2">
                                  <div>
                                    {log?.logOrder?.discountType !==
                                      log?.newLogOrder?.discountType && (
                                      <p className="text-sm text-black1">
                                        Loại:{" "}
                                        {log?.newLogOrder?.discountType ===
                                        "PERCENT"
                                          ? "Theo %"
                                          : "Theo giá trị"}
                                      </p>
                                    )}
                                    <div className="flex gap-1 text-sm text-black1">
                                      {log?.logOrder?.discountType !==
                                      log?.newLogOrder?.discountType ? (
                                        log?.newLogOrder?.discountType ===
                                        "PERCENT" ? (
                                          <p>Tỷ lệ: </p>
                                        ) : (
                                          <p>Giá trị: </p>
                                        )
                                      ) : log?.newLogOrder?.discountType ===
                                        "PERCENT" ? (
                                        <p>Tỷ lệ: </p>
                                      ) : (
                                        <p>Giá trị: </p>
                                      )}
                                      {log?.newLogOrder?.discount && (
                                        <p>
                                          {formatMoney(
                                            log?.newLogOrder?.discount
                                          )}
                                          {log?.newLogOrder?.discountType
                                            ? log?.newLogOrder?.discountType ===
                                              "PERCENT"
                                              ? "%"
                                              : "đ"
                                            : log?.newLogOrder?.discountType ===
                                              "PERCENT"
                                            ? "%"
                                            : "đ"}{" "}
                                        </p>
                                      )}
                                      {log?.logOrder?.newDiscountType ===
                                      "PERCENT" ? (
                                        log?.logOrder?.newDiscount >
                                        log?.logOrder?.discount ? (
                                          <BsArrowUpShort
                                            size={21}
                                            color="#2DB894"
                                          />
                                        ) : (
                                          <BsArrowDownShort
                                            size={21}
                                            color="red"
                                          />
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {log?.logOrder?.discountNote !==
                              log?.newLogOrder?.discountNote && (
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-sm text-black1">
                                    Lý do: {log?.logOrder?.discountNote}
                                  </p>
                                </div>

                                <div className="w-1/10 flex items-center justify-center">
                                  <AiOutlineArrowRight color="gray" />
                                </div>

                                <div className="flex-1">
                                  <p className="text-sm text-black1">
                                    Lý do: {log?.newLogOrder?.discountNote}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Phụ thu */}
                        {(log?.logOrder?.surcharge !==
                          log?.newLogOrder?.surcharge ||
                          log?.logOrder?.surchargeType !==
                            log?.newLogOrder?.surchargeType ||
                          log?.logOrder?.surchargeNote !==
                            log?.newLogOrder?.surchargeNote) && (
                          <div>
                            <div className="flex items-center gap-1">
                              <img
                                src={icons.iconSurcharge}
                                alt=""
                                className="h-3 w-3"
                              />
                              <p className="font-medium">Phụ thu</p>
                            </div>

                            {log?.logOrder?.surcharge !==
                              log?.newLogOrder?.surcharge && (
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  {log?.logOrder?.surchargeType !==
                                    log?.newLogOrder?.surchargeType && (
                                    <p className="text-sm text-black1">
                                      Loại:{" "}
                                      {log?.logOrder?.surchargeType ===
                                      "PERCENT"
                                        ? "Theo %"
                                        : "Theo giá trị"}
                                    </p>
                                  )}
                                  {log?.logOrder?.surcharge !==
                                    log?.newLogOrder?.surcharge && (
                                    <p className="text-sm text-black1">
                                      Tỷ lệ:{" "}
                                      {formatMoney(log?.logOrder?.surcharge)}
                                      {log?.logOrder?.surchargeType ===
                                      "PERCENT"
                                        ? "%"
                                        : "đ"}
                                    </p>
                                  )}
                                </div>

                                <div className="w-1/10 flex items-center justify-center">
                                  <AiOutlineArrowRight color="gray" />
                                </div>

                                <div className="flex flex-1 items-center gap-2">
                                  <div>
                                    {log?.logOrder?.surchargeType !==
                                      log?.newLogOrder?.surchargeType && (
                                      <p className="text-sm text-black1">
                                        Loại:{" "}
                                        {log?.newLogOrder?.surchargeType ===
                                        "PERCENT"
                                          ? "Theo %"
                                          : "Theo giá trị"}
                                      </p>
                                    )}
                                    <div className="flex gap-1 text-sm text-black1">
                                      {log?.logOrder?.surchargeType !==
                                      log?.newLogOrder?.surchargeType ? (
                                        log?.newLogOrder?.surchargeType ===
                                        "PERCENT" ? (
                                          <p>Tỷ lệ: </p>
                                        ) : (
                                          <p>Giá trị: </p>
                                        )
                                      ) : log?.newLogOrder?.surchargeType ===
                                        "PERCENT" ? (
                                        <p>Tỷ lệ: </p>
                                      ) : (
                                        <p>Giá trị: </p>
                                      )}
                                      {log?.newLogOrder?.surcharge && (
                                        <p>
                                          {formatMoney(
                                            log?.newLogOrder?.surcharge
                                          )}
                                          {log?.newLogOrder?.surchargeType
                                            ? log?.newLogOrder
                                                ?.surchargeType === "PERCENT"
                                              ? "%"
                                              : "đ"
                                            : log?.newLogOrder
                                                ?.surchargeType === "PERCENT"
                                            ? "%"
                                            : "đ"}{" "}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {log?.logOrder?.surchargeNote !==
                              log?.newLogOrder?.surchargeNote && (
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-sm text-black1">
                                    Lý do: {log?.logOrder?.surchargeNote}
                                  </p>
                                </div>

                                <div className="w-1/10 flex items-center justify-center">
                                  <AiOutlineArrowRight color="gray" />
                                </div>

                                <div className="flex-1">
                                  <p className="text-sm text-black1">
                                    Lý do: {log?.newLogOrder?.surchargeNote}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ),
            }))}
        />
      )}
    </Modal>
  );
};

export default HistoryOrder;
