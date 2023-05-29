import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Form, Modal, Input } from "antd";
import { toast } from "react-toastify";
import { useCancelOrderMutation } from "../../../api/orderApiSlice";
const { TextArea } = Input;

const CancelOrder = ({ order, open, setOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [cancelOrder, { isLoading: isLoadingCancel }] =
    useCancelOrderMutation();

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onCancelOrder = async (data) => {
    try {
      await cancelOrder({
        orderId: order?.id,
        reason: data?.reason || "",
      }).unwrap();
      onClose();
      navigate(-1);
    } catch (error) {
      toast.error("Huỷ đơn thất bại");
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        danger
        className="flex-1"
        onClick={() => {
          setOpen(true);
        }}
      >
        Huỷ đơn (F4)
      </Button>
      <Modal
        title="Huỷ đơn"
        open={open}
        centered
        okText="Xác nhận"
        okButtonProps={{ danger: true }}
        cancelText="Đóng"
        onCancel={onClose}
        confirmLoading={isLoadingCancel}
        onOk={form.submit}
        destroyOnClose
      >
        <p>Lý do huỷ đơn</p>
        <Form form={form} autoComplete="off" onFinish={onCancelOrder}>
          <Form.Item name="reason">
            <TextArea
              rows={4}
              className="mt-2"
              placeholder="Nhập lý do huỷ đơn"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CancelOrder;
