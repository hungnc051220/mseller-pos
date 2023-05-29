import { Button, Form, Input, Modal, notification } from "antd";
import { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import {
  useAddGroupFoodMutation,
  useEditGroupFoodMutation,
} from "../../api/groupFoodApiSlice";

const CreateAndUpdateFoodGroup = ({ isEditGroup, item }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addGroupFood, { isLoading: isLoadingAdd }] = useAddGroupFoodMutation();
  const [editGroupFood, { isLoading: isLoadingEdit }] =
    useEditGroupFoodMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
   
    if (!isEditGroup) {
      form.resetFields();
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isEditGroup) {
      form.setFieldsValue({
        name: item.name,
      });
    }
  }, [isEditGroup]);

  const handleSubmit = async (values) => {
    try {
      if (isEditGroup) {
        await editGroupFood({ id: item.id, name: values.name }).unwrap();
      } else {
        await addGroupFood(values).unwrap();
      }

      notification.success({
        message: `${isEditGroup ? "Sửa" : "Tạo"}  nhóm thực đơn`,
        description: `${isEditGroup ? "Sửa" : "Tạo"} nhóm thực đơn thành công!`,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  return (
    <>
      {isEditGroup ? (
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
        title={`${isEditGroup ? "Sửa" : "Tạo"} nhóm thực đơn`}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        destroyOnClose
        confirmLoading={isLoadingAdd || isLoadingEdit}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Tên nhóm thực đơn"
            rules={[
              {
                required: true,
                message: "Tên nhóm không được để trống",
              },
            ]}
          >
            <Input placeholder="Nhập tên nhóm thực đơn" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateAndUpdateFoodGroup;
