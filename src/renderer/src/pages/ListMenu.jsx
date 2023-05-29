import { Button, Input, Tag } from "antd";
import { useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useGetFoodsQuery } from "../api/foodApiSlice";
import { CategoryCard, CreateAndUpdateFood } from "../components";
import { classNames, formatMoney } from "../utils/common";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import removeAccents from "vn-remove-accents";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import axios from "axios";

const ListMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetFoodsQuery({});
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(false);

  const onCreate = async (val) => {
    const body = {
      name: val.name,
      groupId: val.groupId,
      quantity: 0,
      price: val.price,
    };

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "body",
        new Blob([JSON.stringify(body)], { type: "application/json" })
      );
      // if (imageFile === null) setErrorFile(true);
      //formData.append("image", imageFile);
      await axios.post(
        `${import.meta.env.RENDERER_VITE_API_URL}/api/menu/food`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              JSON.parse(sessionStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateMulti = async () => {
    for(let i =0; i < foods.length; i++){
      await onCreate(foods[i])
    }
  }

  const handleUpload = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setFoods(json);
        console.log(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Thực đơn</h1>
          {/* <input type="file" onChange={(e) => handleUpload(e)} />
          <Button onClick={onCreateMulti}>Thêm nhiều</Button> */}
          <CreateAndUpdateFood
            data={data}
            refetch={refetch}
            open={open}
            close={() => {setSelectedFood(null);setOpen(false)}}
            edit={edit}
            selectedFood={selectedFood}
            setSelectedFood={setSelectedFood}
          />
          <Button
            type="primary"
            onClick={() => {
              setEdit(false);
              setOpen(true);
            }}
          >
            Thêm món
          </Button>
        </div>
        <Input
          size="large"
          className="mt-4"
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
          {data?.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
            />
          ))}
  
        </div>
        <Scrollbars style={{ height: "calc(100vh - 350px" }} autoHide>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-5">
            {data
              ?.filter((x) => (currentCategory ? x.id === currentCategory : x))
              .map((item) => {
                return item.foods
                  .filter((x) =>
                    removeAccents(x.name.toLowerCase()).includes(
                      removeAccents(search.toLowerCase())
                    )
                  )
                  .map((food) => {
                    return (
                      <motion.div
                        layout
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between py-4 pr-4 "
                        key={food.id}
                      >
                        <div
                          className="relative flex flex-1 cursor-pointer items-center gap-2"
                          onClick={() => {
                            setSelectedFood({ ...food, groupId: item.id });
                            setOpen(true);
                          }}
                        >
                          <img
                            src={food.image}
                            alt="food"
                            className={classNames(
                              food.soldOut ? "opacity-30" : "",
                              "h-20 w-20 rounded-xl object-cover"
                            )}
                          />

                          <div>
                            <Tag color="#FF9141">{item.name.toUpperCase()}</Tag>
                            {food.soldOut && (
                              <Tag color="#ff0000">Hết hàng</Tag>
                            )}
                            <p>{food.name}</p>
                            <p>{formatMoney(food.price)}đ</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  });
              })}
          </motion.div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default ListMenu;
