import { Button, Modal, notification } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFoodsQuery } from "../../api/foodApiSlice";
import { useUpdateOrderMutation } from "../../api/orderApiSlice";
import {
  ListFood,
  OrderCart,
} from "../../components";
import {
  calculateTotalMoney,
  clearOrder,
  addAllToCart,
} from "../../features/cart/cartSlice";

const UpdateOrder = ({ orderFoods, orderId }) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetFoodsQuery({});
  const [open, setOpen] = useState(false);
  const totalMoney = useSelector(calculateTotalMoney);
  const [updateOrder, {isLoading: isLoadingUpdate}] = useUpdateOrderMutation();
  const { orderFoods: newOrderFoods} = useSelector(state => state.cart);
 
  const showModal = () => {
    setOpen(true);
    if (orderFoods && orderFoods.length > 0) {
      dispatch(addAllToCart(orderFoods));
    }
  };
  const handleCancel = () => {
    setOpen(false);
    dispatch(clearOrder());
  };

  const onUpdateOrder = async () => {
    try {
      const data = {
        id: orderId,
        note: "",
        orderFoods: newOrderFoods.reduce(function (map, obj) {
          map[obj.id] = obj.quantity;
          return map;
        }, {}),
        noteFoods: newOrderFoods.reduce(function (map, obj) {
          map[obj.id] = obj.note;
          return map;
        }, {}),
        totalCost: totalMoney,
      };

      const response = await updateOrder(data).unwrap();
      notification.success({
        message: "Sửa đơn thành công",
        description: (
          <p>
            Sửa đơn cho{" "}
            <span className="font-semibold">
              {response.data.floor.name} - {response.data.table.name}
            </span>{" "}
            thành công!
          </p>
        ),
        placement: "bottomRight",
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Sửa đơn thất bại",
        description: (
          <p>
           {error?.data?.title}
          </p>
        ),
        placement: "bottomRight",
      });
    }
  };  

  return (
    <>
      <Button type="primary" block size="large" onClick={showModal}>
        Sửa đơn
      </Button>
      <Modal
        open={open}
        onCancel={handleCancel}
        className="w-10/12"
        footer={null}
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="mt-8 mb-4 text-xl font-bold">Sửa đơn</h2>
        </div>
        <div className="flex">
          <div className="w-1/2 pr-6">
            <ListFood foods={data} />
          </div>
          <div className="flex w-1/2 flex-col items-center justify-start px-6 tablet:w-1/2">
            <OrderCart
              title="Cập nhật"
              handleCancel={handleCancel}
              onConfirm={onUpdateOrder}
              isLoading={isLoadingUpdate}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateOrder;
