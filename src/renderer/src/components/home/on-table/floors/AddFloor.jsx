import { Button, Form, Input, Modal, notification } from "antd";
import { useState } from "react";
import { useCreateFloorMutation } from "@/api/floorApiSlice";

const AddFloor = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createFloor, { isLoading }] = useCreateFloorMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      await createFloor({
        name: values.name,
      }).unwrap();
      notification.success({
        message: "Tạo tầng",
        description: <p>Tạo tầng mới thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  return (
    <>
    <Button type="primary" ghost onClick={showModal}>+Tạo tầng</Button>
      <Modal
        title="Thêm tầng"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Tên tầng"
            rules={[
              {
                required: true,
                message: "Tên tầng không được để trống",
              },
            ]}
          >
            <Input placeholder="Nhập tên tầng" maxLength={50}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddFloor;
