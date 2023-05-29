import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { addNoteToCart } from "../../features/cart/cartSlice";
import { Input } from "antd";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const InputNote = ({ food }) => {
  const dispatch = useDispatch();

  const debouncedSearch = useRef(
    debounce((note) => {
      dispatch(addNoteToCart({ ...food, note }));
    }, 800)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex items-center gap-1">
      <HiOutlinePencilSquare size={16} className="mb-1"/>
      <Input.TextArea
        placeholder="Ghi chú"
        bordered={false}
        prefix={<HiOutlinePencilSquare />}
        defaultValue={food.note}
        className="pl-0 text-gray-500"
        onChange={(e) => debouncedSearch(e.target.value)}
        autoSize
      />
    </div>
  );
};

export default InputNote;
