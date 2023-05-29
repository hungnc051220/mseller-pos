import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  InputNumber,
  notification,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlinePlus } from "react-icons/ai";
import { useAddCostRevenueMutation } from "../../../api/costRevenue";

const { Option } = Select;

const AddCostRevenue = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [addCostRevenue, { isLoading }] = useAddCostRevenueMutation();

  const onAddCostRevenue = async (values) => {
    try {
      await addCostRevenue(values).unwrap();
      notification.success({
        message: "Tạo giao dịch",
        description: <p>Tạo giao dịch thành công!</p>,
        placement: "bottomRight",
      });
      setIsOpen(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4 flex justify-end">
      <Button
        type="primary"
        icon={<AiOutlinePlus />}
        className="flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        Tạo phiếu
      </Button>
      <Modal
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          form.resetFields();
        }}
        onOk={form.submit}
        confirmLoading={isLoading}
      >
        <Form form={form} onFinish={onAddCostRevenue} layout="vertical">
          <Form.Item
            name="transactionType"
            label="Loại giao dịch"
            className="mb-3"
            initialValue="cost"
          >
            <Select>
              <Option value="cost">Chi</Option>
              <Option value="revenue">Thu</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung giao dịch"
            rules={[
              {
                required: true,
                message: "Nội dung giao dịch không được để trống",
              },
            ]}
            className="mb-3"
          >
            <Input.TextArea placeholder={t("content")} rows={3} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Số tiền"
            rules={[
              {
                required: true,
                message: "Số tiền không được để trống",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập số tiền"
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

export default AddCostRevenue;
