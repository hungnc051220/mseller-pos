import { Button, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  calculateTotalItemsWithId,
  decreaseCart,
  removeFromCart,
} from "../features/cart/cartSlice";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { saveToCart } from "../features/cart/cartSlice";

const ButtonChangeQuantity = ({ food }) => {
  const dispatch = useDispatch();
  const quantity = useSelector((state) =>
    calculateTotalItemsWithId(state, food)
  );

  const handleDecrease = (food) => {
    if (quantity > 1) dispatch(decreaseCart(food));
    else dispatch(removeFromCart(food));
  };

  const onChangeQuantity = (value, food) => {
    dispatch(saveToCart({...food, quantity: value}))
  } 

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        shape="circle"
        className="flex items-center justify-center"
        icon={<AiOutlineMinus />}
        onClick={() => handleDecrease(food)}
      />
      <InputNumber
        value={quantity}
        min={0.1}
        controls={false}
        className="w-16 text-center"
        onChange={(value) => onChangeQuantity(value, food)}
      />
      <Button
        type="primary"
        shape="circle"
        className="flex items-center justify-center"
        icon={<AiOutlinePlus />}
        color="white"
        onClick={() => dispatch(addToCart(food))}
      />
    </div>
  );
};

export default ButtonChangeQuantity;
