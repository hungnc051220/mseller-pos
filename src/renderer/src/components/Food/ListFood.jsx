import { Input, Spin, Tag } from "antd";
import React, { memo, useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import removeAccents from "vn-remove-accents";
import { CategoryCard } from "@/components";
import { addToCart } from "@/features/cart/cartSlice";
import { classNames, formatMoney } from "@/utils/common";
import { useDebouncedState } from "@mantine/hooks";
import { toast } from "react-toastify";

const ListFood = ({ categories, foods, isLoading, setLastSelectedFood }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useDebouncedState("", 200);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [filterFoods, setFilterFoods] = useState([]);
  const toastId = useRef(null);

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.keyCode === 37 && cursor > 0) {
        setCursor((prevState) => prevState - 1);
      } else if (e.keyCode === 38 && cursor > 2) {
        setCursor((prevState) => prevState - 3);
      } else if (e.keyCode === 39 && cursor < filterFoods.length - 1) {
        setCursor((prevState) => prevState + 1);
      } else if (
        e.keyCode === 40 &&
        cursor >= 0 &&
        filterFoods.length - cursor > 3
      ) {
        setCursor((prevState) => prevState + 3);
      }

      if (e.keyCode === 13) {
        const food = filterFoods.find((x, index) => index === cursor);
        let options = [];
        food?.optionGroups?.map((item) => {
          item?.options?.forEach((option) => {
            if (option?.defaultSelection === true) {
              options.push(option);
            }
          });
        });

        dispatch(addToCart({ ...food, options }));

        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(
            <p>
              Đã thêm <span className="font-semibold">{food.name}</span> vào giỏ
              hàng
            </p>,
            { position: "top-center" }
          );
        }

        if (toast.isActive(toastId.current)) {
          toast.update(toastId.current, {
            render: (
              <p>
                Đã thêm <span className="font-semibold">{food.name}</span> vào
                giỏ hàng
              </p>
            ),
            position: "top-center",
          });
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [filterFoods, cursor, currentCategory]);

  useEffect(() => {
    if (foods) {
      setFilterFoods(foods);
    }
  }, [foods]);

  useEffect(() => {
    setCursor(0);
    if (currentCategory) {
      setFilterFoods(foods?.filter((food) => food.groupId === currentCategory));
    } else {
      setFilterFoods(foods);
    }
  }, [currentCategory, foods]);

  useEffect(() => {
    setFilterFoods(
      foods.filter((food) =>
        removeAccents(food.name.toLowerCase()).includes(
          removeAccents(search.toLowerCase())
        )
      )
    );
  }, [search]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin tip="Đang tải danh sách món ăn..." />
      </div>
    );
  }
  return (
    <>
      <Input
        size="large"
        className="mt-4"
        placeholder="Tìm món..."
        prefix={<CiSearch size={20} />}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="categories-container flex items-center justify-start space-x-2 overflow-x-auto py-4">
        {categories?.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
          />
        ))}
      </div>
      <Scrollbars
        // style={{ flex: 1, overflowX: "hidden", minHeight: "400px" }}
        className="h-[calc(100vh_-_235px)]"
        autoHide
      >
        <div className="sm:grid-col-2 grid grid-cols-1 tablet:grid-cols-3">
          {filterFoods.map((food, foodIdx) => {
            return (
              <div
                className={classNames(
                  food.soldOut ? "pointer-events-none opacity-30" : "",
                  foodIdx === cursor
                    ? "rounded-lg border-primary bg-primary/10 shadow-sm transition"
                    : "border-transparent",
                  "flex items-center justify-between border px-2 py-2"
                )}
                key={food.id}
              >
                <div
                  className={classNames(
                    "flex flex-1 cursor-pointer items-center gap-2"
                  )}
                  onClick={() => {
                    let options = [];
                    food?.optionGroups?.map((item) => {
                      item?.options?.forEach((option) => {
                        if (option?.defaultSelection === true) {
                          options.push(option);
                        }
                      });
                    });
                    setCursor(foodIdx);
                    dispatch(addToCart({ ...food, options }));

                    if(setLastSelectedFood){
                      setLastSelectedFood(food.name);
                    }
                  }}
                >
                  <img
                    src={food.image}
                    alt="food"
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <Tag color="#FF9141">{food.groupName.toUpperCase()}</Tag>
                    <p>{food.name}</p>
                    <p>{formatMoney(food.price)}đ</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Scrollbars>
    </>
  );
};

export default memo(ListFood);
