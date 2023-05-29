import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { SlPencil } from "react-icons/sl";
import { useDeleteFloorMutation, useEditFloorMutation } from "../../../../api/floorApiSlice";

const EditFloor = ({ floor }) => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);

  const [editFloor, { isLoading }] = useEditFloorMutation();
  const [deleteFloor, { isLoading: isLoadingDelete }] = useDeleteFloorMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalDelete = () => {
    setIsOpenDelete(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      await editFloor({
        id: floor?.id,
        name: values.name,
      }).unwrap();
      notification.success({
        message: "Sửa tầng",
        description: <p>Sửa tầng thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  useEffect(() => {
    if (selectedFloor) {
      form.setFieldsValue({
        name: floor?.name,
      });
    }
  }, [selectedFloor]);

  const onDeleteFloor = async () => {
    try {
      await deleteFloor(selectedFloor?.id).unwrap();
      notification.success({
        message: "Xoá tầng",
        description: <p>Xoá tầng thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <SlPencil
        className="cursor-pointer text-primary"
        onClick={() => {
          setSelectedFloor(floor);
          showModal();
        }}
      />
      <Modal
        title="Sửa tầng"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        okText="Lưu"
        cancelText="Đóng"
        destroyOnClose
      >
        <div className="flex justify-end">
          <Button danger ghost onClick={showModalDelete}>
            Xoá tầng
          </Button>
          <Modal
            title="Xoá tầng"
            open={isOpenDelete}
            centered
            okButtonProps={{ danger: true }}
            onOk={onDeleteFloor}
            onCancel={() => setIsOpenDelete(false)}
            confirmLoading={isLoadingDelete}
            okText="Xác nhận"
            cancelText="Đóng"
            destroyOnClose
          >
            <p>
              Bạn có chắc chắn muốn xoá{" "}
              <span className="font-medium text-blue-500">
                {selectedFloor?.name}
              </span>{" "}
              này không?
            </p>
          </Modal>
        </div>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Sửa tầng"
            rules={[
              {
                required: true,
                message: "Tên tầng không được để trống",
              },
            ]}
          >
            <Input placeholder="Nhập tên tầng" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditFloor;
