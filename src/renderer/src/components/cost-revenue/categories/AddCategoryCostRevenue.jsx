import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useCreateFloorMutation } from "@/api/floorApiSlice";
import {
  useAddCategoryCostRevenueMutation,
  useUpdateCategoryCostRevenueMutation,
} from "../../../api/categoryCostRevenue";
import { BsPencil } from "react-icons/bs";
import { toast } from "react-toastify";

const AddCategoryCostRevenue = ({ isEdit, item }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCategory, { isLoading }] = useAddCategoryCostRevenueMutation();
  const [updateCategory, { isLoading: isLoadingUpdate }] =
    useUpdateCategoryCostRevenueMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (!isEdit) {
      form.resetFields();
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({ name: item.content });
    }
  }, [isEdit, item]);

  const handleSubmit = async (values) => {
    try {
      await createCategory({
        content: values.name,
      }).unwrap();
      toast.success("Tạo khoản mục thành công!");
      handleCancel();
    } catch (error) {
      console.log(error);
      if(error?.data && error?.data?.title){
        toast.error(error?.data?.title)
      }
      else {
        toast.error("Có lỗi bất thường xảy ra. Vui lòng thử lại!")
      }
    }
  };

  const handleUpdateCategory = async (values) => {
    try {
      await updateCategory({
        id: item.id,
        content: values.name,
      }).unwrap();
      toast.success("Sửa khoản mục thành công!");
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  return (
    <>
      {!isEdit ? (
        <Button type="primary" onClick={showModal}>
          +Thêm khoản mục
        </Button>
      ) : (
        <BsPencil
          color="blue"
          size={18}
          className="cursor-pointer hover:opacity-70"
          onClick={showModal}
        />
      )}
      <Modal
        title={`${isEdit ? "Sửa" : "Thêm"} khoản mục`}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading || isLoadingUpdate}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={isEdit ? handleUpdateCategory : handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên khoản mục"
            rules={[
              {
                required: true,
                message: "Tên khoản mục không được để trống",
              },
            ]}
          >
            <Input placeholder="Nhập tên khoản mục" maxLength={50} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCategoryCostRevenue;
