import {
  Button,
  Modal,
  Form,
  Input,
  notification,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Radio,
} from "antd";
import React, { useState, useEffect } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useAddFoodOptionMutation,
  useAssignFoodOptionMutation,
  useEditFoodOptionMutation,
} from "../../api/foodOptionApiSlice";
import ListFoodsOption from "./ListFoodsOption";
import { useGetFoodsQuery } from "../../api/foodApiSlice";
import { AiOutlineEdit, AiOutlineQuestionCircle } from "react-icons/ai";
import { toast } from "react-toastify";

const ContentGroupSelect = ({
  handleCancel,
  valChecked,
  isEdit,
  foodOption,
}) => {
  const [form] = Form.useForm();
  const [addFoodOption, { isLoading: isLoadingAdd }] =
    useAddFoodOptionMutation();
  const [assignFoodOption, { isLoading: isLoadingLink }] =
    useAssignFoodOptionMutation();
  const [editFoodOption, { isLoading: isLoadingEdit }] =
    useEditFoodOptionMutation();
  const [isOnSubmit, setIsOnSubmit] = useState(true);

  const onChange = (e, key) => {
    const fields = form.getFieldsValue();
    const { options } = fields;

    const newList = options?.map((item, index) => ({
      ...item,
      defaultSelection: e.target.checked && index === key ? true : false,
    }));
    form.setFieldsValue({ options: newList });
  };

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        name: foodOption.name,
        maxSelection: foodOption.maxSelection,
        options: foodOption.options.map((item) => {
          return {
            name: item.name,
            price: item.price,
            defaultSelection: item.defaultSelection,
          };
        }),
      });
    }
  }, [isEdit]);

  //Hàm tạo và không liên kết nhóm món ăn
  const onAdd = async (val) => {
    try {
      await addFoodOption(val).unwrap();

      notification.success({
        message: "Thêm nhóm lựa chọn",
        description: "Thêm nhóm lựa chọn thành công!",
        placement: "bottomRight",
      });
      handleCancel();
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm tạo và liên kết nhóm món ăn
  const onAddAndLink = async (val) => {
    try {
      if (valChecked.length > 0) {
        const response = await addFoodOption(val).unwrap();
        const data = { foodIds: valChecked, id: response?.data?.id };
        await assignFoodOption(data).unwrap();
        toast.success(`Liên kết với nhóm ${response?.data.name} thành công!`, {
          theme: "colored",
        });
        handleCancel();
        form.resetFields();
      } else {
        toast.error("Bạn cần chọn 1 món ăn để liên kết", { theme: "colored" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm sửa nhóm món ăn
  const onEdit = async (val) => {
    try {
      await editFoodOption(val).unwrap();
      await assignFoodOption({
        foodIds: valChecked,
        id: foodOption?.id,
      }).unwrap();
      toast.success(`Cập nhật nhóm ${foodOption?.name} thành công!`, {
        theme: "colored",
      });

      if (valChecked.length === 0) {
        toast.warning(
          `Các món trong nhóm ${foodOption?.name} không còn liên kết`,
          {
            theme: "colored",
          }
        );
      }
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md flex-1">
      <div className="flex flex-col items-center justify-center">
        <h2 className="mt-8 mb-4 text-xl font-bold">
          {isEdit ? "Sửa" : "Thêm"} nhóm lựa chọn
        </h2>
      </div>
      <Form
        name="dynamic_form_nest_item"
        onFinish={isOnSubmit ? (isEdit ? onEdit : onAddAndLink) : onAdd}
        autoComplete="off"
        layout="vertical"
        form={form}
        initialValues={{ maxSelection: 1 }}
      >
        {isEdit && (
          <Form.Item hidden initialValue={foodOption.id} name="id"></Form.Item>
        )}

        <Row gutter={8}>
          <Col span={18}>
            <Form.Item
              label="Tên nhóm"
              name="name"
              rules={[
                { required: true, message: "Hãy nhập tên nhóm lựa chọn" },
              ]}
              style={{ marginBottom: "3px" }}
            >
              <Input placeholder="Nhập tên nhóm lựa chọn" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Chọn tối đa"
              name="maxSelection"
              style={{ marginBottom: "3px" }}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="options" initialValue={[{ name: "", price: 0 }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={8}>
                  <Col span={15}>
                    <Row>
                      <Col span={24}>
                        {" "}
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          label={`Lựa chọn ${name + 1}`}
                          rules={[
                            { required: true, message: "Hãy nhập lựa chọn" },
                          ]}
                          style={{ marginBottom: "10px", marginTop: "13px" }}
                        >
                          <Input placeholder="Nhập tên lựa chọn ..." />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        {" "}
                        <Form.Item
                          noStyle
                          name={[name, "defaultSelection"]}
                          valuePropName="checked"
                          {...restField}
                        >
                          <Checkbox
                            value={name}
                            name={name}
                            key={key}
                            onChange={(e) => onChange(e, key)}
                          >
                            Chọn làm mặc định
                          </Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={9}>
                    {" "}
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      label="Giá tiền (đ)"
                      rules={[{ required: true, message: "Hãy nhập giá tiền" }]}
                      style={{ marginBottom: "10px", marginTop: "13px" }}
                    >
                      <InputNumber
                        min={0}
                        maxLength={10}
                        placeholder="Nhập giá tiền ..."
                        defaultValue={0}
                        controls={false}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        className="w-full"
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <div
                        className=" cursor-pointer text-right text-red-500"
                        onClick={() => remove(name)}
                      >
                        Xóa lựa chọn
                      </div>
                    )}
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <div className=" flex items-center  justify-end">
                  <Button
                    type="link"
                    onClick={() => add()}
                    className=" flex items-center text-base text-primary"
                    icon={<PlusOutlined />}
                  >
                    Thêm lựa chọn
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          {isEdit ? (
            <Button
              type="primary"
              className="mb-2 w-full"
              size="large"
              htmlType="submit"
              loading={isLoadingEdit}
            >
              Lưu
            </Button>
          ) : (
            <div>
              {" "}
              <Button
                type="primary"
                className="mb-2 w-full"
                size="large"
                htmlType="submit"
                onClick={() => setIsOnSubmit(true)}
                loading={isLoadingAdd || isLoadingLink}
              >
                Xác nhận liên kết này
              </Button>
              <Button
                className="mb-2 w-full text-primary"
                size="large"
                htmlType="submit"
                onClick={() => setIsOnSubmit(false)}
                loading={isLoadingAdd}
              >
                Tạo và không liên kết
              </Button>
            </div>
          )}

          <Button className="w-full" size="large" onClick={handleCancel}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const CreateAndUpdateGroupSelect = ({ isEdit, foodOption }) => {
  const { data, isLoading, refetch } = useGetFoodsQuery({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [valChecked, setValChecked] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkedValue = (val) => {
    setValChecked(val);
  };

  return (
    <>
      {isEdit ? (
        <Button
          type="link"
          className="text-primary"
          icon={<AiOutlineEdit size={23} />}
          onClick={showModal}
        />
      ) : (
        <Button type="primary" onClick={showModal}>
          Thêm nhóm
        </Button>
      )}

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="90vw"
        destroyOnClose
      >
        <div className="flex flex-col gap-9 md:flex-row">
          <ContentGroupSelect
            handleCancel={handleCancel}
            valChecked={valChecked}
            isEdit={isEdit}
            foodOption={foodOption}
          />
          <ListFoodsOption
            foods={data}
            checkedValue={checkedValue}
            isEdit={isEdit}
            foodOption={foodOption}
          />
        </div>
      </Modal>
    </>
  );
};

export default CreateAndUpdateGroupSelect;
