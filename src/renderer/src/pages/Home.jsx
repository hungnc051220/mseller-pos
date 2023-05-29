import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Spin, Tabs } from "antd";
import { BiDish, BiShoppingBag } from "react-icons/bi";
import { useGetFloorsQuery } from "@/api/floorApiSlice";
import { useGetOrdersQuery } from "@/api/orderApiSlice";
import {
  AddFloor,
  CategoryCard,
  FloorCard,
  OrderListWaitingConfirm,
  TakeawayOrders,
} from "@/components";
import { fetchFoods } from "@/features/foods/foodsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [currentFloor, setCurrentFloor] = useState(null);

  const { data, isLoading } = useGetFloorsQuery(
    {},
    { refetchOnReconnect: true }
  );

  const {
    data: dataOrders,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
  } = useGetOrdersQuery(
    { pageSize: 10000, orderStatuses: ["WAITING"], web: true },
    { refetchOnReconnect: true }
  );

  const { data: dataOrderTakeAway, isLoading: isLoadingTakeAway } =
    useGetOrdersQuery(
      {
        pageSize: 10000,
        takeAway: true,
        onTable: false,
        orderStatuses: ["CREATED"],
      },
      { refetchOnReconnect: true }
    );

  useEffect(() => {
    dispatch(fetchFoods({}));
  }, []);

  return (
    <div className="pb-4">
      {/* Tiêu đề Tại chỗ - Mang về */}
      {dataOrders?.content?.length > 0 && (
        <OrderListWaitingConfirm
          orders={dataOrders?.content || []}
          isLoadingOrders={isLoadingOrders}
          isFetchingOrders={isFetchingOrders}
        />
      )}

      <Tabs
        defaultActiveKey="0"
        type="card"
        size="large"
        items={[
          {
            key: "0",
            label: (
              <span className="flex items-center gap-1">
                <BiDish />
                Tại bàn:{" "}
                <span className="text-red-500">
                  {data ? data?.tableTotalCount - data?.tableEmptyCount : ""}
                </span>
              </span>
            ),
            children: (
              <Spin spinning={isLoading}>
                {/* Danh mục tầng */}
                <div className="categories-container flex items-center justify-start gap-2 overflow-x-auto">
                  <CategoryCard
                    name="Tất cả"
                    id={null}
                    currentCategory={currentFloor}
                    setCurrentCategory={setCurrentFloor}
                  />
                  {data?.floors.map((item) => {
                    return (
                      <CategoryCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        currentCategory={currentFloor}
                        setCurrentCategory={setCurrentFloor}
                      />
                    );
                  })}
                  <AddFloor />
                </div>

                {/* Danh sách tầng và bàn */}
                <div className="space-y-6 py-4">
                  {data?.floors
                    ?.filter((x) => (currentFloor ? x.id === currentFloor : x))
                    .map((floor) => (
                      <FloorCard
                        key={floor.id}
                        floor={floor}
                        floors={data?.floors}
                      />
                    ))}
                </div>
              </Spin>
            ),
          },
          {
            key: "1",
            label: (
              <span className="flex items-center gap-1">
                <BiShoppingBag />
                Mang đi:{" "}
                <span className="text-red-500">
                  {dataOrderTakeAway?.totalElements || 0}
                </span>
              </span>
            ),
            children: (
              <TakeawayOrders
                orders={dataOrderTakeAway}
                isLoading={isLoadingTakeAway}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Home;
