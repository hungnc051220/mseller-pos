import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  calculateTotalItemsWithId,
  decreaseCart,
  removeFromCart,
} from "../features/cart/cartSlice";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const ButtonChangeQuantityWithNote = ({ food, count, setCount }) => {
  const dispatch = useDispatch();
  const quantity = useSelector((state) =>
    calculateTotalItemsWithId(state, food)
  );

  const handleDecrease = (food) => {
    if (quantity > 1) dispatch(decreaseCart(food));
    else dispatch(removeFromCart(food));
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        shape="circle"
        className="flex items-center justify-center"
        icon={<AiOutlineMinus />}
        onClick={() => setCount((prev) => prev - 1)}
      />
      <span>{count}</span>
      <Button
        type="primary"
        shape="circle"
        className="flex items-center justify-center"
        icon={<AiOutlinePlus />}
        color="white"
        onClick={() => setCount((prev) => prev + 1)}
      />
    </div>
  );
};

export default ButtonChangeQuantityWithNote;
