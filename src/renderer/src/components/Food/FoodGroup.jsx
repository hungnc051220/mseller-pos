import { RadioGroup } from "@headlessui/react";
import { useEffect } from "react";
import { useState } from "react";
import { classNames, formatMoney } from "../../utils/common";

const FoodGroup = ({ group, selectedFood, orderFoods, setOrderFoods }) => {
  const [selected, setSelected] = useState(
    group.options.find((x) => x.defaultSelection === true) || null
  );

  const onCheckedOption = (option) => {
    setSelected(option);
    setOrderFoods((prev) => ({
      ...prev,
      [group.id]: [{ id: option.id, name: option.name, price: option.price }],
    }));
  };
  useEffect(() => {
    if (selected) {
      setOrderFoods((prev) => ({
        ...prev,
        [group.id]: [
          {
            id: selected.id,
            name: selected.name,
            price: selected.price,
          },
        ],
      }));
    }
  }, [selected]);

  useEffect(() => {
    setSelected(
      group.options.find(
        (x) =>
          x.id === selectedFood.options.flat(1).find((option) => option.id === x.id)?.id
      )
    );
  }, []);

  return (
    <RadioGroup value={selected} onChange={onCheckedOption} className="w-full">
      <RadioGroup.Label>
        {group.name} (Chọn tối đa: {group.maxSelection})
      </RadioGroup.Label>
      <div className="mt-1 rounded-md bg-white">
        {group.options.map((option, optionIdx) => (
          <RadioGroup.Option
            key={option.id}
            value={option}
            className={({ checked }) =>
              classNames(
                optionIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                optionIdx === group.options.length - 1
                  ? "rounded-bl-md rounded-br-md"
                  : "",
                checked
                  ? "z-10 border-primary/30 bg-primary/5"
                  : "border-gray-200",
                "relative flex cursor-pointer flex-row-reverse items-center border p-4 focus:outline-none"
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span
                  className={classNames(
                    checked
                      ? "border-transparent bg-primary"
                      : "border-gray-300 bg-white",
                    active ? "ring-1 ring-primary/80 ring-offset-2" : "",
                    "mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border"
                  )}
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="mr-4 flex flex-1 flex-col">
                  <RadioGroup.Label
                    as="span"
                    className={classNames(
                      checked ? "text-primary" : "text-gray-900",
                      "block text-sm font-medium"
                    )}
                  >
                    {option.name}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className={classNames(
                      checked ? "text-primary" : "text-gray-500",
                      "block text-sm"
                    )}
                  >
                    {formatMoney(option.price)}đ
                  </RadioGroup.Description>
                </span>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default FoodGroup;
