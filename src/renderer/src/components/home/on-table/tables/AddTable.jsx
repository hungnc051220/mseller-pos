import { useState } from "react";
import { Form, Input, Modal, notification } from "antd";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import { useCreateTableMutation } from "@/api/tableApiSlice";

const AddTable = ({ floorId }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createTable, { isLoading }] = useCreateTableMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      await createTable({
        floorId,
        name: values.name,
      }).unwrap();
      notification.success({
        message: "Tạo bàn",
        description: <p>Tạo bàn mới thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  return (
    <>
      <motion.div
        layout
        className="h-24 cursor-pointer overflow-hidden rounded-[10px] border border-dashed border-primary bg-white"
        onClick={showModal}
      >
        <div className="relative flex h-full flex-1 flex-col items-center justify-center p-4">
          <AiOutlinePlus size={20} className="text-primary" />
          <p className="mt-2 text-base text-primary">Tạo bàn</p>
        </div>
      </motion.div>
      <Modal
        title="Thêm bàn"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Tên bàn"
            rules={[
              {
                required: true,
                message: "Tên bàn không được để trống",
              },
            ]}
          >
            <Input placeholder="Nhập tên bàn" maxLength={50}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddTable;
