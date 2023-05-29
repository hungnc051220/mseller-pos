import { useDeleteCostRevenueMutation } from "@/api/costRevenue";
import { Modal } from "antd";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-toastify";

const DeleteCostRevenue = ({ crId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCostRevenue, { isLoading }] =
    useDeleteCostRevenueMutation();

  const onDeleteCostRevenue = async () => {
    try {
      await deleteCostRevenue(crId).unwrap();
      toast.success("Xoá phiếu thu thành công!")
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
        onOk={onDeleteCostRevenue}
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

export default DeleteCostRevenue;
