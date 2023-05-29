import { Button, Form, Modal, notification } from "antd";
import { useState } from "react";
import { useDeleteCategoryCostRevenueMutation } from "../../../api/categoryCostRevenue";
import { HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-toastify";

const DeleteCategoryCostRevenue = ({ categoryId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCategory, { isLoading }] =
    useDeleteCategoryCostRevenueMutation();

  const onDeleteCategory = async () => {
    try {
      await deleteCategory(categoryId).unwrap();
      toast.success("Xoá khoản mục thành công!")
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <HiOutlineTrash
        color="red"
        size={24}
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer hover:opacity-70"
      />
      <Modal
        title="Xóa khoản mục"
        open={isModalOpen}
        onOk={onDeleteCategory}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        okButtonProps={{ danger: true }}
        confirmLoading={isLoading}
        cancelText="Đóng"
        destroyOnClose
      >
        <p>Bạn có chắc chắn muốn xóa khoản mục này không?</p>
      </Modal>
    </>
  );
};

export default DeleteCategoryCostRevenue;
