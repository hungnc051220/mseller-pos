import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, notification, Select } from "antd";
import { SlPencil } from "react-icons/sl";
import { useDeleteTableMutation, useEditTableMutation } from "@/api/tableApiSlice";

const { Option } = Select;

const EditTable = ({ floors, table, floorId }) => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const [editTable, { isLoading }] = useEditTableMutation();
  const [deleteTable, { isLoading: isLoadingDelete}] = useDeleteTableMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalDelete = () => {
    setIsOpenDelete(true);
  };

  const handleCancel = () => {
    //form.resetFields();
    setSelectedTable(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedTable) {
      form.setFieldsValue({
        name: selectedTable.name,
        newFloorId: floorId,
      });
    }
  }, [selectedTable]);

  const handleSubmit = async (values) => {
    try {
      await editTable({
        id: selectedTable.id,
        name: values.name,
        floorId,
        newFloorId: values.newFloorId,
      }).unwrap();
      notification.success({
        message: "Sửa bàn",
        description: <p>Sửa bàn thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  const onDeleteTable = async () => {
    try {
      await deleteTable(selectedTable?.id).unwrap();
      notification.success({
        message: "Xoá bàn",
        description: <p>Xoá bàn thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
        onClick={() => {
          setSelectedTable(table);
          showModal();
        }}
      >
        <SlPencil className="text-primary" />
      </div>
      <Modal
        title="Sửa bàn"
        open={isModalOpen}
        onOk={form.submit}
        okText="Lưu"
        cancelText="Đóng"
        onCancel={handleCancel}
        confirmLoading={isLoading}
        destroyOnClose
      >
        <div className="flex justify-end">
          <Button danger ghost onClick={showModalDelete}>
            Xoá bàn
          </Button>
          <Modal
            title="Xoá bàn"
            open={isOpenDelete}
            centered
            okText="Xác nhận"
            okButtonProps={{ danger: true }}
            onOk={onDeleteTable}
            onCancel={() => setIsOpenDelete(false)}
            confirmLoading={isLoadingDelete}
            cancelText="Đóng"
            destroyOnClose
          >
            <p>
              Bạn có chắc chắn muốn xoá{" "}
              <span className="font-medium text-blue-500">
                {selectedTable?.name}
              </span>{" "}
              này không?
            </p>
          </Modal>
        </div>
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
            <Input placeholder="Nhập tên bàn" />
          </Form.Item>
          <Form.Item
            name="newFloorId"
            label="Tầng"
            rules={[
              {
                required: true,
                message: "Tầng không được để trống",
              },
            ]}
          >
            <Select>
              {floors?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditTable;
