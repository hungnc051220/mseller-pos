import { useEffect, useState } from "react";
import {} from "react";
import { classNames, formatMoney } from "../../utils/common";
import { Checkbox, Col, Row } from "antd";

const FoodGroupCheckbox = ({
  group,
  selectedFood,
  orderFoods,
  setOrderFoods,
}) => {
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    setOrderFoods((prev) => ({ ...prev, [group.id]: checkedList }));
  }, [checkedList]);

  useEffect(() => {
    const currentSelectedOptions = group.options.filter(
      (x) =>
        x.id === selectedFood.options.flat(1).find((y) => y.id === x.id)?.id
    );
    setCheckedList(currentSelectedOptions);
  }, []);

  return (
    <Checkbox.Group
      style={{
        width: "100%",
        flexDirection: "column",
      }}
      value={checkedList}
    >
      <p className="mb-1">
        {group.name} (Chọn tối đa: {group.maxSelection})
      </p>
      {group.options.map((option, optionIdx) => (
        <div
          key={option.id}
          className={classNames(
            optionIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
            optionIdx === group.options.flat(1).length - 1
              ? "rounded-bl-md rounded-br-md"
              : "",
            checkedList.includes(option)
              ? "z-10 border-primary/30 bg-primary/5"
              : "border-gray-200",
            "relative flex w-full cursor-pointer items-center border border-gray-200 p-4 focus:outline-none"
          )}
          onClick={() => {
            const indexOption = checkedList.findIndex(
              (x) => x.id === option.id
            );
            if (indexOption > -1) {
              const newArray = checkedList.filter((x) => x.id !== option.id);
              setCheckedList(newArray);
            } else {
              if (checkedList.length < group.maxSelection) {
                setCheckedList((prev) => [...prev, option]);
              }
            }
          }}
        >
          <div className="min-w-0 flex-1 text-sm">
            <label htmlFor="comments" className="font-medium text-gray-700">
              {option.name}
            </label>
            <p id="comments-description" className="text-gray-500">
              {formatMoney(option.price)}đ
            </p>
          </div>
          <div className="ml-3 flex h-5 items-center">
            <Checkbox value={option} />
          </div>
        </div>
      ))}
    </Checkbox.Group>
  );
};

export default FoodGroupCheckbox;
