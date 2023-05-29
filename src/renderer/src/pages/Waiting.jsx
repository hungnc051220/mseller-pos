import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, Empty, Spin, Checkbox, Select } from "antd";
import {
  useCompleteFoodMutation,
  useCompleteMultiFoodsMutation,
  useGetFoodWaitingQuery,
} from "@/api/foodApiSlice";
import { groupBy } from "core-js/actual/array/group-by";

const Waiting = () => {
  const { data, isLoading, isFetching } = useGetFoodWaitingQuery({
    pageSize: 1000,
    pageNumber: 0,
    direction: "ASC",
    sortBy: "id",
  });
  const [completeFood, { isLoading: isLoadingComplete }] =
    useCompleteFoodMutation();
  const [completeMultiFoods, { isLoading: isLoadingCompleteMultiFoods }] =
    useCompleteMultiFoodsMutation();

  const [selectedFood, setSelectedFood] = useState(null);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [viewType, setViewType] = useState("time");
  const [newList, setNewList] = useState([]);
  const [plainOptionsOrder, setPlainOptionsOrder] = useState([]);

  const onCheckAllChange = (e) => {
    setCheckedList(
      e.target.checked
        ? viewType === "time"
          ? data?.content
          : plainOptionsOrder
        : []
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    if (!selectedFood) return;

    const onComplete = async (data) => {
      try {
        await completeFood(data).unwrap();
        setSelectedFood(null);
      } catch (error) {
        console.log(error);
      }
    };

    onComplete(selectedFood);
  }, [selectedFood]);

  useEffect(() => {
    if (data && data?.content.length > 0) {
      let listMapped =
        viewType === "time"
          ? data?.content?.groupBy(({ updatedAt }) => updatedAt)
          : data?.content?.groupBy(({ orderId }) => orderId);
      const mapped = Object.entries(listMapped).map(([k, v]) => ({
        key: k,
        value: v,
      }));
      setNewList(mapped);

      if (viewType === "order") {
        setPlainOptionsOrder(mapped.map((order) => order.key));
      }
    }
  }, [data, viewType]);

  const onCompleteMulti = async () => {
    try {
      let bodyData = [];

      if (viewType === "time") {
        const foodsGroupByOrderId = checkedList.groupBy(
          ({ orderId }) => orderId
        );
        bodyData = Object.entries(foodsGroupByOrderId).map(([k, v]) => ({
          orderId: k,
          foodIds: v.map((food) => `${food.id}${food.index}`),
        }));
      } else {
        bodyData = checkedList.map((orderId) => ({
          orderId,
          foodIds: [],
        }));
      }

      await completeMultiFoods(bodyData).unwrap();
      setNewList([]);
      setPlainOptionsOrder([]);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin tip="Đang tải danh sách món đang chờ" />
      </div>
    );
  }

  return data?.content?.length > 0 ? (
    <div className="bg-gray-100 -mt-6 -mx-6 min-h-full p-6">
    <Spin spinning={isLoadingCompleteMultiFoods}>
      <div className="w-full space-y-3 pb-6">
        <div className="flex w-full flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-1 sm:mb-0">
            <span className="mr-2 text-sm text-black1">Chế độ xem: </span>
            <Select
              className="mr-4"
              style={{ width: 150 }}
              value={viewType}
              onChange={(value) => {
                setViewType(value);
                setCheckAll(false);
                setCheckedList([]);
              }}
              options={[
                { value: "time", label: "Theo thời gian" },
                { value: "order", label: "Theo đơn bàn" },
              ]}
            />
          </div>
          <div>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              <span className="text-base mb-[2px] text-primary">Chọn tất cả</span>
            </Checkbox>
            <Button
            type="primary"
              className="ml-0 mt-1 sm:ml-2 sm:mt-0 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-200"
              disabled={checkedList.length === 0}
              onClick={onCompleteMulti}
            >
              Hoàn thành các món đã chọn
            </Button>
          </div>
        </div>
        <Checkbox.Group
          className="block w-full space-y-6"
          value={checkedList}
          onChange={(checkedValues) => {
            setCheckedList(checkedValues);
            setIndeterminate(
              !!checkedValues.length &&
                checkedValues.length <
                  (viewType === "time"
                    ? data?.content?.length
                    : plainOptionsOrder.length)
            );
            setCheckAll(
              checkedValues.length ===
                (viewType === "time"
                  ? data?.content?.length
                  : plainOptionsOrder.length)
            );
          }}
        >
          {newList?.map((item, index) => {
            return (
              <div
                key={index}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-black1 font-semibold">
                    {viewType === "time"
                      ? dayjs(item.key).format("HH:mm DD/MM/YYYY")
                      : item?.value[0].position}
                  </p>
                  {viewType === "order" && <Checkbox value={item.key} />}
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {item.value.map((food) => (
                    <div
                      className="flex items-center gap-3 text-sm text-black1 border border-gray-200 rounded-lg p-3 bg-white"
                      key={food.index}
                    >
                      {viewType === "time" && <Checkbox value={food} />}
                      <img
                        src={food.image}
                        alt="food"
                        className="h-10 min-w-[40px] overflow-hidden rounded-lg object-cover sm:h-16 sm:min-w-[64px]"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{food.name}</p>
                        <p className="font-medium">Số lượng: {food.quantity}</p>
                        {food?.options && food?.options.length > 0 && (
                          <p>
                            +{" "}
                            {food?.options?.map((item) => item.name).join(", ")}
                          </p>
                        )}
                        <p>Ghi chú: {food.note || "Không có"}</p>
                      </div>
                      <div className="space-between flex flex-col gap-1">
                        <p>{food.position}</p>
                        <Button
                          className="bg-primary text-white"
                          onClick={() =>
                            setSelectedFood({
                              orderId: food.orderId,
                              foodId: food.id,
                              index: food.index,
                            })
                          }
                          loading={
                            isLoadingComplete &&
                            selectedFood?.index === food.index
                          }
                        >
                          Hoàn tất
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Checkbox.Group>
      </div>
    </Spin>
    </div>
  ) : (
    <div className="flex h-full items-center justify-center">
      <Empty
        image="https://cdn-icons-png.flaticon.com/512/2722/2722162.png"
        imageStyle={{ display: "flex", justifyContent: "center" }}
        description="Hiện không có món đang chờ"
      />
    </div>
  );
};

export default Waiting;
