import React, { useState, useEffect, memo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { CiSearch } from "react-icons/ci";
import { Avatar, Checkbox, Form, Input, List, Tag } from "antd";
import { motion } from "framer-motion";
import removeAccents from "vn-remove-accents";
import { CategoryCard } from "../../components";
import { AiOutlineLink } from "react-icons/ai";
import { formatMoney } from "../../utils/common";

const ListFoodGroupCard = ({
  foods,
  search,
  allCheckedList,
  setAllCheckedList,
}) => {
  const filterList = foods?.filter((x) =>
    removeAccents(x.name.toLowerCase()).includes(
      removeAccents(search.toLowerCase())
    )
  );
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    var ids = new Set(filterList.map((d) => d.id));
    const merged = [...allCheckedList.filter((x) => ids.has(x))];
    setCheckedList(merged);
  }, []);

  useEffect(() => {
    setIndeterminate(
      checkedList.length && checkedList.length !== filterList.length
    );
    setCheckAll(checkedList.length === filterList.length);
  }, [checkedList]);

  function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
  }

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? filterList.map((item) => item.id) : []);
    setCheckAll(e.target.checked);
    const ids = filterList.map((item) => item.id);

    if (e.target.checked) {
      const listDuplicate = arrayUnique(allCheckedList.concat(ids));
      setAllCheckedList(listDuplicate);
    } else {
      const listToRemove = allCheckedList.filter((el) => !ids.includes(el));
      setAllCheckedList(listToRemove);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between pl-6 mt-2">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          <span className="ml-2 text-base text-primary">Chọn tất cả</span>
        </Checkbox>
        <div className="ml-6">
          {allCheckedList.length > 0 ? (
            <Tag color="green">Tổng số món đã chọn {allCheckedList.length}</Tag>
          ) : (
            <Tag color="red">Chưa có món nào được chọn</Tag>
          )}
        </div>
      </div>
      <Checkbox.Group
        className="block"
        value={checkedList}
        onChange={(checkedValues) => {
          setCheckedList(checkedValues);
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={filterList}
          renderItem={(item) => (
            <List.Item
              actions={
                item.optionGroups.length > 0
                  ? [
                      <Tag
                        color="blue"
                        icon={<AiOutlineLink />}
                        className="flex items-center gap-1 "
                      >
                        {" "}
                        Có {item.optionGroups.length} liên kết nhóm
                      </Tag>,
                    ]
                  : undefined
              }
              className="hover:bg-primary/5"
            >
              <List.Item.Meta
                className="cursor-pointer"
                onClick={() => {
                  if (allCheckedList.includes(item.id)) {
                    const newArray = allCheckedList.filter(
                      (x) => x !== item.id
                    );
                    setAllCheckedList(newArray);
                    const newArray2 = checkedList.filter((x) => x !== item.id);
                    setCheckedList(newArray2);
                  } else {
                    setAllCheckedList((prev) => [...prev, item.id]);
                    setCheckedList((prev) => [...prev, item.id]);
                  }
                }}
                avatar={
                  <div className="flex items-center justify-center gap-4">
                    <Checkbox
                      value={item.id}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          const filterList = allCheckedList.filter(
                            (x) => x !== e.target.value
                          );
                          setAllCheckedList(filterList);
                        } else {
                          const concatList = arrayUnique(
                            allCheckedList.concat([e.target.value])
                          );
                          setAllCheckedList(concatList);
                        }
                      }}
                    />
                    <img
                      src={item.image}
                      alt="food image"
                      className="min-w-16 h-16 rounded-md border border-gray-200 object-cover p-1 shadow-sm"
                    />
                  </div>
                }
                title={<p>{item.name}</p>}
                description={`${formatMoney(item.price)}đ`}
              />
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </div>
  );
};

const ListFoodsOption = ({ foods, checkedValue, isEdit, foodOption }) => {
  const [allCheckedList, setAllCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [search, setSearch] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    checkedValue(allCheckedList);
  }, [allCheckedList]);

  useEffect(() => {
    if (isEdit) {
      setAllCheckedList(foodOption?.foodIds);
    }
  }, [isEdit]);

  // Tất cả danh sách Id các món
  const allListFoodIds = foods?.flatMap((items) =>
    items.foods.map((item) => item.id)
  );

  const allFoods = foods
    .map(function (val) {
      return val.foods;
    })
    .reduce(function (pre, cur) {
      return pre.concat(cur);
    })
    .map(function (e, i) {
      return e;
    });

  useEffect(() => {
    setIndeterminate(
      allCheckedList.length && allCheckedList.length !== allFoods.length
    );
    setCheckAll(allCheckedList.length === allFoods.length);
  }, [allCheckedList]);

  const onCheckAll = (e) => {
    setAllCheckedList(e.target.checked ? allListFoodIds : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex  items-center justify-center ">
        <h2 className="mt-8 mb-4 text-xl font-bold">Nhóm liên kết</h2>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="">
          <Input
            className=" "
            placeholder="Tìm món..."
            prefix={<CiSearch size={20} />}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="categories-container flex items-center justify-start space-x-2 overflow-x-auto py-4">
            <CategoryCard
              name="Tất cả"
              id={null}
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
            />
            {foods?.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                currentCategory={currentCategory}
                setCurrentCategory={setCurrentCategory}
              />
            ))}
          </div>
        </div>

        <Scrollbars
          style={{ flex: 1, overflowX: "hidden", minHeight: "250px" }}
          autoHide
        >
          {!currentCategory ? (
            <div>
              <div className="flex items-center justify-between pl-6">
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAll}
                  checked={checkAll}
                >
                  <span className="ml-2 text-base text-primary">
                    Chọn tất cả
                  </span>
                </Checkbox>
                <div className="ml-6  ">
                  {allCheckedList.length > 0 ? (
                    <Tag color="green">
                      Tổng số món đã chọn {allCheckedList.length}
                    </Tag>
                  ) : (
                    <Tag color="red">Chưa có món nào được chọn</Tag>
                  )}
                </div>
              </div>
              <Checkbox.Group
                className="block"
                value={allCheckedList}
                onChange={(checkedValues) => {
                  setAllCheckedList(checkedValues);
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={allFoods}
                  renderItem={(item) => (
                    <List.Item
                      actions={
                        item.optionGroups.length > 0
                          ? [
                              <Tag
                                color="blue"
                                icon={<AiOutlineLink />}
                                className="flex items-center gap-1 "
                              >
                                {" "}
                                Có {item.optionGroups.length} liên kết nhóm
                              </Tag>,
                            ]
                          : undefined
                      }
                      className="hover:bg-primary/5"
                    >
                      <List.Item.Meta
                        className="cursor-pointer"
                        onClick={() => {
                          if (allCheckedList.includes(item.id)) {
                            const filterListChecked = allCheckedList.filter(
                              (x) => x !== item.id
                            );
                            setAllCheckedList(filterListChecked);
                          } else {
                            setAllCheckedList((prev) => [...prev, item.id]);
                          }
                        }}
                        avatar={
                          <div className="flex items-center justify-center gap-4">
                            <Checkbox value={item.id} />
                            <img
                              src={item.image}
                              alt="food image"
                              className="min-w-16 h-16 rounded-md border border-gray-200 object-cover p-1 shadow-sm"
                            />
                          </div>
                        }
                        title={<p>{item.name}</p>}
                        description={`${formatMoney(item.price)}đ`}
                      />
                    </List.Item>
                  )}
                />
              </Checkbox.Group>
            </div>
          ) : (
            foods
              ?.filter((x) => x.id === currentCategory)
              .map((item) => {
                return (
                  <ListFoodGroupCard
                    key={item.id}
                    foods={item.foods}
                    allFoods={allFoods}
                    search={search}
                    currentCategory={currentCategory}
                    allCheckedList={allCheckedList}
                    setAllCheckedList={setAllCheckedList}
                  />
                );
              })
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default memo(ListFoodsOption);
