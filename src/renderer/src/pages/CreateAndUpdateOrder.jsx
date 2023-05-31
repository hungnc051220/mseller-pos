import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Modal, notification } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetFloorsQuery } from "../api/floorApiSlice";
import { useGetFoodsQuery } from "../api/foodApiSlice";
import {
  useCreateOrderMutation,
  useGetOrderByTableQuery,
  useGetOrderQuery,
  useRefuseOrderMutation,
  useAcceptOrderMutation,
  useUpdateOrderMutation,
  useGetOrderDetailChangeQuery,
  useAfterPayOrderMutation,
} from "../api/orderApiSlice";
import {
  CancelOrder,
  ChangeTable,
  HistoryOrder,
  ListFood,
  OrderCart,
  PaymentOrder,
  PrintOrder,
} from "../components";
import FoodDetail from "../components/Food/FoodDetail";
import {
  calculateTotalMoney,
  clearOrder,
  addAllToCart,
} from "../features/cart/cartSlice";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { AiOutlineArrowLeft, AiOutlineHistory } from "react-icons/ai";
import { useGetTableQuery } from "../api/tableApiSlice";

const CreateAndUpdateOrder = ({ isEdit }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const tableId = location.state && location.state.tableId;
  const tableName = location.state && location.state.tableName;
  const floorId = location.state && location.state.floorId;
  const floorName = location.state && location.state.floorName;
  const orderId = location.state && location.state.orderId;

  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [openChangeTable, setOpenChangeTable] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [lastSelectedFood, setLastSelectedFood] = useState(null);
  const [discountType, setDiscountType] = useState("PERCENT");
  const [surchargeType, setSurchargeType] = useState("PERCENT");
  const [discount, setDiscount] = useState(0);
  const [surcharge, setSurcharge] = useState(0);
  const [discountNote, setDiscountNote] = useState("");
  const [surchargeNote, setSurchargeNote] = useState("");
  const [order, setOrder] = useState();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const { data: dataTable } = useGetTableQuery(!isEdit ? tableId : skipToken, {
    refetchOnMountOrArgChange: true,
  });
  
  useEffect(() => {
    if(!isEdit){
      dispatch(clearOrder());
    }
    if(!isEdit && dataTable){
      dispatch(addAllToCart(dataTable?.data?.foodDefaults?.map(item => ({...item, quantity: 1})) || []));
    }
  }, [isEdit, dataTable])

  const onChangeDiscountType = (value) => {
    console.log(value);
    setDiscountType(value);
    setDiscount(0);
  };

  const onChangeSurchargeType = (value) => {
    setSurchargeType(value);
    setSurcharge(0);
  };

  const { data, isLoading } = useGetFoodsQuery({});

  useEffect(() => {
    if (data) {
      const categoriesFood = data.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      const categoryAll = [{ id: null, name: "Tất cả" }];
      setCategories([...categoryAll, ...categoriesFood]);

      const mappedFoods = data
        .map((item) => {
          return item.foods.map((food) => ({
            ...food,
            groupId: item.id,
            groupName: item.name,
          }));
        })
        .flat(1);
      const FoodsWithIndex = mappedFoods.map((food, foodIdx) => ({
        ...food,
        foodIdx,
      }));
      setFoods(FoodsWithIndex);
    }
  }, [data]);

  const { data: dataFloors, isLoading: isLoadingFloors } = useGetFloorsQuery();
  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    refetch,
  } = useGetOrderQuery(isEdit ? orderId : skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: dataOrderChangeDetail,
    isLoading: isLoadingOrderChangeDetal,
    refetch: refetchDetail,
  } = useGetOrderDetailChangeQuery(isEdit ? orderId : skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const [refuseOrder, { isLoading: isLoadingRefuseOrder }] =
    useRefuseOrderMutation();
  const [acceptOrder, { isLoading: isLoadingAccept }] =
    useAcceptOrderMutation();
  const { orderFoods, hasUpdate, statusPayment } = useSelector(
    (state) => state.cart
  );
  const totalMoney = useSelector(calculateTotalMoney);

  const dispatch = useDispatch();
  const [createOrder, { isLoading: isLoadingCreate }] =
    useCreateOrderMutation();
  const [updateOrder, { isLoading: isLoadingUpdate }] =
    useUpdateOrderMutation();
  const [afterPay, { isLoading: isLoadingAfterPay }] =
    useAfterPayOrderMutation();

    const [openTbilling, setOpenTbilling] = useState(false);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        if (dataOrder?.status === "WAITING") {
          onAcceptOrder();
        } else if (isEdit) {
          onUpdateOrder();
        } else {
          onCreateOrder();
        }
      } else if (event.key === "F4") {
        event.preventDefault();
        if (dataOrder?.status === "WAITING") {
          onRefuseOrder();
        } else if (isEdit) {
          setOpenCancelOrder(true);
          setOpenChangeTable(false);
          setOpenPayment(false);
        }
      } else if (event.key === "F2") {
        event.preventDefault();
        if (isEdit) {
          if(
            dataOrder?.foods?.findIndex((item) => item.tbillingTime === true && !item.billingTime?.endTime) > -1
          ) {
            setOpenTbilling(true);
            return;
          };
          setOpenPayment(true);
          setOpenCancelOrder(false);
          setOpenChangeTable(false);
        }
      } else if (event.key === "F3") {
        event.preventDefault();
        if (isEdit) {
          setOpenChangeTable(true);
          setOpenCancelOrder(false);
          setOpenPayment(false);
        }
      } else if (event.key === "F9") {
        event.preventDefault();
        if (isEdit) {
          handlePrint();
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [
    orderFoods,
    discount,
    surcharge,
    discountType,
    discountNote,
    surchargeType,
    surchargeNote,
  ]);

  useEffect(() => {
    if (hasUpdate) {
      refetch();
    }
  }, [hasUpdate]);

  useEffect(() => {
    if (statusPayment) {
      navigate(-1);
    }
  }, [statusPayment]);

  // useEffect(() => {
  //   if (!isEdit) dispatch(clearOrder());
  // }, [isEdit]);

  useEffect(() => {
    if (dataOrder) {
      dispatch(addAllToCart(dataOrder?.foods || []));
      setDiscountType(dataOrder?.discountType || "PERCENT");
      setDiscount(dataOrder?.discount || 0);
      setDiscountNote(dataOrder?.discountNote);
      setSurchargeType(dataOrder?.surchargeType || "PERCENT");
      setSurcharge(dataOrder?.surcharge || 0);
      setSurchargeNote(dataOrder?.surchargeNote);
      setOrder(dataOrder);
    }
  }, [dataOrder]);

  const [isOpen, setIsOpen] = useState(true);
  const handleCancel = () => {
    setIsOpen(false);
    navigate(-1);
  };

  const destroyAll = () => {
    Modal.destroyAll();
  };

  const onCreateOrder = async () => {
    if (orderFoods.length === 0) {
      toast.error("Vui lòng chọn món ăn", {
        theme: "colored",
        toastId: "selectFoods",
      });
      return;
    }
    try {
      const data = {
        tableId,
        floorId,
        orderFoods: orderFoods.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
          optionIds: item.options?.flat(1).map((option) => option.id),
          note: item.note,
        })),
        promotion: "",
        totalCost:
          Math.round(totalMoney -
          (discountType === "PERCENT"
            ? (totalMoney * discount) / 100
            : discount) +
          (surchargeType === "PERCENT"
            ? (totalMoney * surcharge) / 100
            : surcharge)),
        discountType,
        surchargeType,
        discount,
        discountNote,
        surcharge,
        surchargeNote,
      };

      await createOrder(data).unwrap();
      dispatch(clearOrder());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateOrder = async () => {
    try {
      const data = {
        id: dataOrder.id,
        orderFoods: orderFoods.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
          optionIds: item.options.flat(1).map((option) => option.id),
          index: item.index,
          note: item.note,
        })),
        note: "",
        totalCost:
          Math.round(totalMoney -
          (discountType === "PERCENT"
            ? (totalMoney * discount) / 100
            : discount) +
          (surchargeType === "PERCENT"
            ? (totalMoney * surcharge) / 100
            : surcharge)),
        discountType,
        surchargeType,
        discount,
        discountNote,
        surcharge,
        surchargeNote,
      };

      let response;
      if (dataOrder.status === "COMPLETED")
        response = await afterPay(data).unwrap();
      else response = await updateOrder(data).unwrap();

      setOrder(response.data);
      refetchDetail();
      toast.success("Cập nhật món thành công!");

      //dispatch(clearOrder());
      //handleCancel();
    } catch (error) {
      toast.error(error?.data?.title || error?.data?.messages?.orderFoods?.[0]);
    }
  };

  const onRefuseOrder = async () => {
    try {
      await refuseOrder(dataOrder?.id).unwrap();
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const onAcceptOrder = async () => {
    try {
      await acceptOrder(dataOrder?.id).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const [isPrinting, setIsPrinting] = useState(false);
  const promiseResolveRef = useRef(null);

  const componentRef = useRef();

  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (order && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [order]);

  // Send print request to the Main process
  const handleBillPrint = function (target) {
    return new Promise(() => {
      console.log("forwarding print request to the main process...");

      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], {type: "text/html;charset=UTF-8"});
      const url = URL.createObjectURL(blob);

      window.electronAPI.printComponent(url, (response) => {
        console.log("Main: ", response);
      });
      //console.log('Main: ', data);
    });
  };

  // Send print preview request to the Main process
  const handleBillPreview = function (target) {
    return new Promise(() => {
      console.log("forwarding print preview request...");

      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], {type: "text/html;charset=UTF-8"});
      const url = URL.createObjectURL(blob);

      window.electronAPI.previewComponent(url, (response) => {
        console.log("Main: ", response);
      });
      //console.log('Main: ', data);
    });
  };


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        onUpdateOrder();
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
    },
    print: handleBillPrint
  });

  return (
    <div className="min-h-screen bg-white p-4">
      <div
        className="mb-2 flex cursor-pointer items-center gap-2 hover:text-primary"
        onClick={() => navigate(-1)}
      >
        <AiOutlineArrowLeft size={16} />
        <p>Quay lại</p>
      </div>
      <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
        <div className="seft-start flex items-center gap-4 sm:self-auto">
          <p className="text-base font-medium">
            Mã HĐ: <span className="font-bold">{dataOrder?.code || ""}</span>
          </p>
          <p className="text-base font-medium">
            {!dataOrder?.codeTakeAway
              ? `Vị trí: ${floorName ? floorName - tableName : ""}`
              : `Mã: #${dataOrder?.codeTakeAway} - Khách hàng: ${
                  dataOrder?.customerName || ""
                }`}
          </p>
        </div>

        {/* {isEdit && (
          <div className="mr-6">
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
              order={dataOrderChangeDetail}
            />
          </div>
        )} */}
      </div>

      <div className="flex flex-1 flex-col gap-5 lg:flex-row">
        <div className="flex w-full flex-col md:w-1/2 xl:w-3/5">
          <div className="flex items-center gap-1">
            <h2 className="text-lg font-bold text-black1">Menu</h2>
            {lastSelectedFood && (
              <p className="text-base">
                (Món vừa chọn:{" "}
                <span className="text-primary">{lastSelectedFood}</span>)
              </p>
            )}
          </div>
          <ListFood
            foods={foods}
            categories={categories}
            isLoading={isLoading}
            setLastSelectedFood={setLastSelectedFood}
          />
        </div>

        <div className="flex w-full flex-col md:w-1/2 xl:w-2/5">
          <div className="flex w-full flex-1 flex-col">
            <h2 className="text-center text-lg font-bold text-black1">
              Giỏ hàng
            </h2>
            <OrderCart
              isEdit={isEdit}
              isLoading={isLoadingCreate || isLoadingUpdate}
              onConfirm={isEdit ? onUpdateOrder : onCreateOrder}
              onCancel={handleCancel}
              order={dataOrder}
              location={location}
              selectedFood={selectedFood}
              setSelectedFood={setSelectedFood}
              discountType={discountType}
              surchargeType={surchargeType}
              onChangeDiscountType={onChangeDiscountType}
              onChangeSurchargeType={onChangeSurchargeType}
              discount={discount}
              surcharge={surcharge}
              discountNote={discountNote}
              surchargeNote={surchargeNote}
              onChangeDiscount={(value) => setDiscount(value)}
              onChangeSurcharge={(value) => setSurcharge(value)}
              onChangeDiscountNote={(e) => setDiscountNote(e.target.value)}
              onChangeSurchargeNote={(e) => setSurchargeNote(e.target.value)}
              refetch={refetch}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {isEdit &&
              dataOrder?.status !== "WAITING" &&
              dataOrder?.status !== "COMPLETED" && (
                <>
                  <CancelOrder
                    order={dataOrder}
                    open={openCancelOrder}
                    setOpen={setOpenCancelOrder}
                  />
                  {dataOrder?.floor && (
                    <ChangeTable
                      open={openChangeTable}
                      setOpen={setOpenChangeTable}
                      floors={dataFloors?.floors || []}
                      table={dataOrder?.table}
                      floorId={dataOrder?.floor?.id}
                      location={location}
                      order={dataOrder}
                      navigate={navigate}
                    />
                  )}
                  <PaymentOrder
                    order={dataOrder}
                    open={openPayment}
                    openTbilling={openTbilling}
                    setOpenTbilling={setOpenTbilling}
                    setOpen={setOpenPayment}
                    refetch={refetch}
                  />
                </>
              )}

            {isEdit && dataOrder?.status !== "WAITING" && (
              <>
                <PrintOrder
                  order={order}
                  open={openCancelOrder}
                  setOpen={setOpenCancelOrder}
                  componentRef={componentRef}
                  handlePrint={handlePrint}
                />
              </>
            )}

            {dataOrder?.status === "WAITING" && (
              <>
                <Button
                  type="primary"
                  danger
                  size="large"
                  className="flex-1"
                  onClick={onRefuseOrder}
                  loading={isLoadingRefuseOrder}
                >
                  Xác nhận (F4)
                </Button>

                <Button
                  type="primary"
                  size="large"
                  className="flex-1"
                  onClick={onAcceptOrder}
                  loading={isLoadingAccept}
                >
                  {"Xác nhận" + " (F1)"}
                </Button>
              </>
            )}

            {dataOrder?.status !== "WAITING" && (
              <Button
                type="primary"
                size="large"
                className={isEdit ? "max-w-[250px] flex-1" : "block w-full"}
                onClick={isEdit ? onUpdateOrder : onCreateOrder}
                loading={
                  isLoadingCreate || isLoadingUpdate || isLoadingAfterPay
                }
              >
                {(isEdit ? t("Cập nhật") : "Tạo đơn") + " (F1)"}
              </Button>
            )}
          </div>

          <FoodDetail
            selectedFood={selectedFood}
            setSelectedFood={setSelectedFood}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateAndUpdateOrder;
