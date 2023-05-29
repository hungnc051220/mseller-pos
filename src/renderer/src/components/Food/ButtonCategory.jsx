import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Input, Form } from "antd";
import { useState } from "react";
const ButtonCategory = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Danh mục
      </Button>
      <Modal open={isModalOpen} footer={null}>
        <div className="flex  items-center justify-center ">
          <h2 className="mt-8 mb-4 text-xl font-bold">Danh mục</h2>
        </div>
        <Form form={form}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              {
                required: true,
                message: "Please input your name",
              },
            ]}
          >
            <div className="flex justify-between gap-2 ">
              <Input   />
              <div className="flex justify-between gap-1">
                {!openSave && (
                  <Button
                    type="primary"
                    ghost
                    onClick={() => setOpenSave(true)}
                   
                  >
                    Sửa
                  </Button>
                )}

                {openSave && (
                  <Button type="primary" ghost onClick={() => setOpenSave(false)}>
                    Lưu
                  </Button>
                )}

                <Button danger>Xóa</Button>
              </div>
            </div>
          </Form.Item>
        </Form>
        <div className="mb-4 flex justify-end ">
          <Button
            type="link"
            icon={<PlusOutlined />}
            className=" flex items-center text-sm text-primary"
          >
            Thêm danh mục
          </Button>
        </div>

        <Button className=" w-full" onClick={handleCancel}>
          Đóng
        </Button>
      </Modal>
    </>
  );
};
export default ButtonCategory;
