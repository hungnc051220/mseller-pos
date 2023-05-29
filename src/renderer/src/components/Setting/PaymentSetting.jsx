import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  List,
  Modal,
  Button,
  notification,
  message,
  QRCode,
  Image,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { createQrCodeStatic } from "../../api";
import { useUserUpdateBankAccountMutation } from "../../api/userApiSlice";

const PaymentSetting = ({ icon, title, content, keyName, dataUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeStatic, setQrCodeStatic] = useState("");
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
  const [userUpdateBankAccount, { isLoading: isLoadingBank }] =
    useUserUpdateBankAccountMutation();

  useEffect(() => {
    if (dataUser) {
      form.setFieldsValue({
        bankAccountName: dataUser.branch.bankAccountName,
        bankAccountNumber: dataUser.branch.bankAccountNumber,
      });
    }
    const createQrStatic = async () => {
      try {
        const response = await createQrCodeStatic({});
        var reader = new window.FileReader();
        reader.readAsText(response.data);
        reader.onload = function () {
          var imageDataUrl = reader.result;
          setQrCodeStatic(imageDataUrl);
        };
      } catch (error) {
        console.log(error);
      }
    };
    createQrStatic();
  }, [dataUser]);

  const onFinish = async (val) => {
    try {
      await userUpdateBankAccount(val).unwrap();
      notification.success({
        message: `Thay đổi thông tin tài khoản thành công`,
        placement: "bottomRight",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.log(error?.data.messages);
      message.open({
        type: "error",
        content: error?.data.messages.bankAccountName[0],
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (!dataUser) {
      form.resetFields();
    }
  };
  return (
    <List.Item className="block hover:bg-gray-50">
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        title={title}
        forceRender
      >
        {keyName === "qrstatic" && (
          <div className="flex justify-center">
            {/* <img width={350} src={qrCodeStatic} /> */}
            <QRCode
              size={300}
              value={qrCodeStatic} />
          </div>
        )}
        {keyName === "qrimenu" && (
          <div className="flex justify-center py-7">
            <QRCode
              size={326}
              value={`${
                import.meta.env.MODE === "development"
                  ? "https://imenu.dev.mseller.vn/"
                  : "https://imenu.mseller.vn/"
              }/?branch_id=${user?.branch?.id}`}
            />
          </div>
        )}
        {keyName === "bank" && (
          <Form
            onFinish={onFinish}
            className="mt-4"
            form={form}
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 19,
            }}
          >
            <Form.Item label="Ngân hàng">
              <Input size="large" value="MB Bank" disabled />
            </Form.Item>

            <Form.Item
              label="Số tài khoản"
              name="bankAccountNumber"
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập số tài khoản`,
                },
              ]}
            >
              <Input size="large" placeholder={`Nhập ${title} ...`} />
            </Form.Item>

            <Form.Item
              label="Tên tài khoản"
              name="bankAccountName"
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập tên tài khoản`,
                },
              ]}
            >
              <Input size="large" placeholder={`Nhập ${title} ...`} />
            </Form.Item>

            <Form.Item className="item-bank mb-0">
              <div className=" flex">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mr-2 w-full"
                  size="large"
                >
                  Lưu
                </Button>
                <Button onClick={handleCancel} className="w-full" size="large">
                  Đóng
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Modal>
      <div
        className="flex items-center py-2 pl-4 "
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex min-w-0 flex-1 items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="min-w-0 px-7 md:grid md:grid-cols-2 md:gap-4 ">
            <div>
              <span className="truncate text-lg font-medium text-primary">
                {title}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                {content}
              </span>
            </div>
          </div>
        </div>
        <div>
          <RightOutlined className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </List.Item>
  );
};

export default PaymentSetting;
