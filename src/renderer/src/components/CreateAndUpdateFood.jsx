import {
  Button,
  Input,
  InputNumber,
  Modal,
  Form,
  Select,
  notification,
  Popconfirm,
  Switch,
  Tag,
  Divider,
  Space,
  Checkbox,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import UploadFile from "./UploadFile";
import axios from "axios";
import {
  useDeleteFoodMutation,
  useSoldOutFoodMutation,
} from "../api/foodApiSlice";
import { useGetGroupFoodsQuery } from "../api/groupFoodApiSlice";
import {
  useAssignFoodToOptionMutation,
  useGetFoodOptionsQuery,
} from "../api/foodOptionApiSlice";
import { AiOutlinePlus } from "react-icons/ai";
import { useGetFloorsQuery } from "../api/floorApiSlice";

const CreateAndUpdateFood = ({
  data,
  refetch,
  open,
  close,
  selectedFood,
  setSelectedFood,
}) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const { data: floors } = useGetFloorsQuery({});

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [errorFile, setErrorFile] = useState(false);
  const [deleteFood, { isLoading: isLoadingDelete }] = useDeleteFoodMutation();
  const [soldOutFood] = useSoldOutFoodMutation();
  const [assignFoodToOption, { isLoading: isLoadingEdit }] =
    useAssignFoodToOptionMutation();
  const [foodSoldOut, setFoodSoldOut] = useState(false);
  const { data: dataGroupFoods, isLoading } = useGetGroupFoodsQuery({});
  const { data: FoodOptions } = useGetFoodOptionsQuery();
  const [visibleBillingTime, setVisibleBillingTime] = useState(false);
  const [visibleBillingTimePerBlock, setVisibleBillingTimePerBlock] =
    useState(false);

  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const [optionUnits, setOptionUnits] = useState([
    "Đĩa",
    "Lon",
    "Thùng",
    "Hộp",
  ]);

  const addItem = (e) => {
    e.preventDefault();
    setOptionUnits([...optionUnits, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (selectedFood) {
      if (selectedFood) {
        setVisibleBillingTimePerBlock(true);
      }

      form.setFieldsValue({
        id: selectedFood.id,
        name: selectedFood.name,
        newGroupId: selectedFood.groupId,
        price: selectedFood.price,
        unit: selectedFood.unit,
        tables: selectedFood.tables,
        tbillingTime: selectedFood.tbillingTime,
        image: selectedFood.image,
        optionGroups: selectedFood?.optionGroups?.map((item) => item.id),
        needProcessing: selectedFood.needProcessing,
        billingTime: {
          timeBlock: selectedFood?.billingTime?.timeBlock,
          pricePerTimeBlock: selectedFood?.billingTime?.pricePerTimeBlock,
          rounding: selectedFood?.billingTime?.rounding,
          billingTimePolicies: selectedFood?.billingTime?.billingTimePolicies,
        },
        changePrice: selectedFood?.changePrice
      });

      setFoodSoldOut(selectedFood.soldOut);
      setVisibleBillingTime(selectedFood.tbillingTime);
    }
  }, [selectedFood]);

  const handleCancel = () => {
    setImageFile(null);
    setSelectedFood(null);
    form.resetFields();
    close();
    setVisibleBillingTime(false);
    setVisibleBillingTimePerBlock(false);
  };

  const onCreate = async (val) => {
    const body = {
      name: val.name,
      groupId: val.groupId,
      quantity: 0,
      price: val.price || 0,
      tbillingTime: val.tbillingTime,
      unit: val.unit,
      billingTime: val.billingTime,
      tables: val.tables,
      changePrice: val?.changePrice
    };

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "body",
        new Blob([JSON.stringify(body)], { type: "application/json" })
      );
      if (imageFile === null) setErrorFile(true);
      formData.append("image", imageFile);

      const response = await axios.post(
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
      setLoading(false);
      refetch();
      handleCancel();
      notification.success({
        message: "Thêm món ăn thành công",
        placement: "bottomRight",
        className: "w-84 h-16 ",
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onUpdate = async (val) => {
    const body = {
      id: selectedFood.id,
      name: val.name,
      groupId: selectedFood.groupId,
      newGroupId: val.newGroupId,
      price: val.price,
      needProcessing: val.needProcessing,
      tbillingTime: val.tbillingTime,
      unit: val.unit,
      billingTime: val.billingTime,
      tables: val.tables,
      changePrice: val?.changePrice
    };

    const valueSoldOut = {
      foodId: selectedFood.id,
      soldOut: foodSoldOut,
    };
    const valueOptionGroups = {
      ids: val.optionGroups,
      foodId: selectedFood.id,
    };

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "body",
        new Blob([JSON.stringify(body)], { type: "application/json" })
      );
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(
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
      await soldOutFood(valueSoldOut).unwrap();
      await assignFoodToOption(valueOptionGroups).unwrap();
      setLoading(false);
      refetch();
      handleCancel();
      notification.success({
        message: "Sửa món ăn thành công",
        placement: "bottomRight",
        className: "w-72 h-16 ",
      });
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Sửa món ăn thất bại",
        description:
          error?.response?.data?.status === 500
            ? "Hệ thống đang gặp lỗi. Vui lòng thử lại sau!"
            : "",
        placement: "bottomRight",
      });
      console.log(error);
    }
  };

  const onDelete = async (foodId) => {
    try {
      await deleteFood(foodId).unwrap();
      notification.success({
        message: "Xóa món ăn thành công",
        placement: "bottomRight",
      });

      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal open={open} onCancel={handleCancel} footer={null}>
        <h2 className="mb-4 mt-8 flex justify-center text-xl font-bold">
          {selectedFood ? "Sửa" : "Thêm"} món ăn
        </h2>
        {selectedFood && (
          <div className="mb-3 flex w-full items-center justify-between">
            <div className="flex justify-start gap-2">
              <Switch
                checked={foodSoldOut}
                onChange={(e) => setFoodSoldOut(e)}
              />

              {!foodSoldOut ? (
                <Tag color="#2DB894">Còn Hàng</Tag>
              ) : (
                <Tag color="#ff0000">Hết hàng</Tag>
              )}
            </div>

            <Popconfirm
              title="Bạn có chắc chắn muốn xóa món ăn này ?"
              overlayStyle={{ width: "310px" }}
              placement="bottom"
              okText="Xác Nhận"
              cancelText="Hủy"
              onConfirm={() => onDelete(selectedFood.id)}
              okButtonProps={{ loading: isLoadingDelete }}
            >
              <Button danger>Xóa món ăn</Button>
            </Popconfirm>
          </div>
        )}

        <Form
          name="wrap"
          labelCol={{
            flex: "110px",
          }}
          labelAlign="left"
          labelWrap
          wrapperCol={{
            flex: 1,
          }}
          colon={false}
          style={{
            maxWidth: 600,
          }}
          onFinish={selectedFood ? onUpdate : onCreate}
          form={form}
          initialValues={{
            needProcessing: true,
          }}
        >
          <Form.Item
            label="Tên món"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên món",
              },
            ]}
          >
            <Input placeholder="Nhập tên món ăn" />
          </Form.Item>
          <Form.Item
            name={selectedFood ? "newGroupId" : "groupId"}
            label="Danh mục"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Chọn nhóm món ăn" allowClear>
              {dataGroupFoods?.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {!visibleBillingTime && (
            <>
              <Form.Item
                name={"unit"}
                label="Đơn vị tính"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Đơn vị tính"
                  allowClear
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: "8px 0",
                        }}
                      />
                      <Space
                        style={{
                          padding: "0 8px 4px",
                        }}
                      >
                        <Input
                          placeholder="Lon, thùng, đĩa..."
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                        />
                        <Button
                          type="text"
                          className="flex items-center justify-center gap-1"
                          icon={<AiOutlinePlus />}
                          onClick={addItem}
                        >
                          Thêm đơn vị tính
                        </Button>
                      </Space>
                    </>
                  )}
                >
                  {optionUnits?.map((item) => {
                    return (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                label="Giá tiền (đ)"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá tiền",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="Nhập giá tiền"
                  controls={false}
                  min={0}
                  max={10000001}
                  maxLength={10}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>

              <Form.Item
            label="Giá linh hoạt"
            name="changePrice"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
            </>
          )}

          <Form.Item name="optionGroups" label="Liên kết nhóm">
            <Select
              placeholder="Chọn nhóm lựa chọn"
              showArrow
              allowClear
              mode="multiple"
            >
              {FoodOptions?.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="tables"
            label="Bàn mặc định cho món"
            className="custom-select-form"
          >
            <Select
              placeholder="Chọn bàn mặc định cho món"
              mode="multiple"
              allowClear
              options={floors?.floors?.map((item) => ({
                label: item.name,
                options: item?.tables?.map((table) => ({
                  label: `${item.name} - ${table.name}`,
                  value: table.id,
                })),
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Cần chế biến"
            name="needProcessing"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Món tính giờ"
            name="tbillingTime"
            valuePropName="checked"
          >
            <Switch onChange={(checked) => setVisibleBillingTime(checked)} />
          </Form.Item>

          {visibleBillingTime && (
            <Form.Item className="mb-6 rounded-lg border border-dashed border-primary bg-primary/10 px-2 py-4">
              <Form.Item className="mb-0">
                <Space
                  style={{
                    display: "flex",
                  }}
                  align="baseline"
                >
                  <Form.Item
                    labelCol={{ span: 24, offset: 0 }}
                    name={["billingTime", "timeBlock"]}
                    label="Đơn vị thời gian"
                    rules={[
                      {
                        required: true,
                        message: "Thời gian không thể để trống",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập thời gian"
                      className="w-full"
                      controls={false}
                    />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24, offset: 0 }}
                    name={["billingTime", "pricePerTimeBlock"]}
                    label="Giá"
                    rules={[
                      {
                        required: true,
                        message: "Giá không thể để trống",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập giá"
                      className="w-full"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      controls={false}
                    />
                  </Form.Item>
                </Space>
              </Form.Item>

              <Form.Item
                name={["billingTime", "rounding"]}
                valuePropName="checked"
              >
                <Checkbox>
                  <p>Làm tròn lên</p>
                  <span className="text-sm text-gray-400">
                    Giá trị đơn sẽ luôn luôn được làm tròn lên trong trường hợp
                    chưa hết chu kì một đơn vị thời gian.
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item
                label="Chính sách giá"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch
                  value={visibleBillingTimePerBlock}
                  onChange={(checked) => setVisibleBillingTimePerBlock(checked)}
                />
              </Form.Item>

              {visibleBillingTimePerBlock && (
                <Form.List name={["billingTime", "billingTimePolicies"]} initialValue={[{
                  fromTime: "",
                  pricePerTimeBlock: ""
                }]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{
                            display: "flex",
                          }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            labelCol={{ span: 24, offset: 0 }}
                            name={[name, "fromTime"]}
                            label="Nếu thời gian từ (phút)"
                            rules={[
                              {
                                required: true,
                                message: "Thời gian không thể để trống",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Nhập thời gian"
                              className="w-full"
                              controls={false}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            labelCol={{ span: 24, offset: 0 }}
                            name={[name, "pricePerTimeBlock"]}
                            label="Giá"
                            rules={[
                              {
                                required: true,
                                message: "Giá không được để trống",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Nhập giá"
                              className="w-full"
                              formatter={(value) =>
                                `${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              }
                              parser={(value) =>
                                value.replace(/\$\s?|(,*)/g, "")
                              }
                              controls={false}
                            />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item className="mb-0 text-right">
                        <a
                          className="text-primary"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          + Thêm giá luỹ kế
                        </a>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              )}
            </Form.Item>
          )}

          <Form.Item
            name="image"
            label={
              <p>
                <span className="text-red-500">*</span> Ảnh sản phẩm
              </p>
            }
          >
            <UploadFile
              imageFile={imageFile}
              setImageFile={setImageFile}
              selectedFood={selectedFood}
            />
            {/* {errorFile && (
              <span className="text-red-500">Vui Lòng thêm ảnh</span>
            )} */}
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex gap-2">
              <Button onClick={handleCancel} className="w-full" size="large">
                Đóng
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="mr-2 w-full"
                size="large"
                loading={loading}
              >
                {selectedFood ? "Lưu" : "Xác nhận"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateAndUpdateFood;
