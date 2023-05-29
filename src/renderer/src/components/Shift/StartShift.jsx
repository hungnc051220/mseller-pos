import { useState } from "react";
import { useStartShiftMutation } from "../../api/shiftApiSlice";
import { Button, Form, InputNumber, Modal } from "antd";
import { useTranslation } from "react-i18next";

const StartShift = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [startShift, { isLoading }] = useStartShiftMutation();

  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const onStartShift = async (values) => {
    try {
      await startShift({
        openingBalance: values.openingBalance,
      }).unwrap();

      notification.success({
        message: "Tạo ca mới",
        description: <p>Tạo ca mới thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }

    handleCancel();
  };

  return (
    <div className="bg-white-500 flex w-[350px] flex-col items-center justify-center rounded-lg border border-gray-100 py-6 px-4 shadow">
      <p className="mb-4 text-gray-400">Không có ca nào đang diễn ra</p>
      <Button
        type="primary"
        className="flex items-center justify-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        Bắt đầu ca
      </Button>

      <Modal
        open={isOpen}
        title="Bắt đầu ca"
        okText="Xác nhận"
        cancelText="Huỷ bỏ"
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        destroyOnClose
      >
        <Form form={form} onFinish={onStartShift} layout="vertical">
          <Form.Item
            name="openingBalance"
            label="Số dư đầu ca"
            rules={[
              {
                required: true,
                message: "Số dư đầu ca không được để trống",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập số dư đầu ca"
              suffix="đ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              className="w-full"
              addonAfter="đ"
              controls={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StartShift;
