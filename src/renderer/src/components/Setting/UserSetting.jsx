import React, { useEffect, useState } from "react";
import { Form, Input, List, Modal, Button, notification, message } from "antd";
import { RightOutlined } from "@ant-design/icons";
import {
  useGetUserQuery,
  useUserChangePasswordMutation,
  useUserUpdateAddressMutation,
  useUserUpdateEmailMutation,
  useUserGenerateOtpMutation,
  useUserUpdateNameMutation,
  useUserUpdatePhoneNumberMutation,
} from "../../api/userApiSlice";
import OTPInput, { ResendOTP } from "otp-input-react";

const FormPassword = ({ onPassword, handleCancel }) => {
  return (
    <>
      <Form onFinish={onPassword} className="mt-4">
        <Form.Item
          name="oldPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu hiện tại",
            },
          ]}
        >
          <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới",
            },
          ]}
        >
          <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập xác nhận lại mật khẩu mới",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu mới không trùng khớp")
                );
              },
            }),
          ]}
          dependencies={["newPassword"]}
        >
          <Input.Password
            size="large"
            placeholder="Xác nhận lại mật khẩu mới"
          />
        </Form.Item>
        <Form.Item className="mb-0">
          <div className="flex gap-2">
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
    </>
  );
};

const UserSetting = ({ icon, title, content, keyName, dataUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [userUpdateName, {isLoading: isLoadingName}] = useUserUpdateNameMutation();
  const [userUpdatePhoneNumber, {isLoading: isLoadingPhone}] = useUserUpdatePhoneNumberMutation();
  const [userUpdateEmail, {isLoading: isLoadingEmail}] = useUserUpdateEmailMutation();
  const [userUpdateAddress, {isLoading: isLoadingAddress}] = useUserUpdateAddressMutation();
  const [userGenerateOtp] = useUserGenerateOtpMutation();
  const [userChangePassword, {isLoading: isLoadingPassword}] = useUserChangePasswordMutation();
  

  const [OTP, setOTP] = useState("");
  const [tokenOTP, setTokenOTP] = useState("");
  const [openOTP, setOpenOTP] = useState(false);
  const [isNewNumberPhone, setIsNewNumberPhone] = useState("");
  const [count, setCount] = useState(60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(intervalId);
      setCount(0);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [count]);

  useEffect(() => {
    if (dataUser) {
      form.setFieldsValue({
        fullName: dataUser.fullName,
        phoneNumber: dataUser.phoneNumber,
        email: dataUser.email,
      });
    }
  }, [dataUser]);


  const onFinish = async (val) => {
    try {
      if (keyName === "fullName") {
        await userUpdateName(val).unwrap();
      } else if (keyName === "email") {
        await userUpdateEmail(val).unwrap();
      } else if (keyName === "address") {
        await userUpdateAddress(val).unwrap();
      }
      notification.success({
        message: `Thay đổi ${title} thành công`,
        placement: "bottomRight",
        className: "h-16 ",
      });

      setIsModalOpen(false);
    } catch (err) {
      message.open({
        type: "error",
        content: err?.data.messages.email[0],
      });
      message.open({
        type: "error",
        content: err?.data.title,
      });
    }
  };
  const onUpdatePhone = async (val) => {
    try {
      const dataUpdatePhoneNumber = await userGenerateOtp(val).unwrap();
      setTokenOTP(dataUpdatePhoneNumber.token);
      setOpenOTP(true);
      setCount(60);
    } catch (err) {
      console.log(err);
    }
    setIsNewNumberPhone(val);
  };

  const onOTP = async (val) => {
    const data = {
      otp: val.otp,
      token: tokenOTP,
    };
    try {
      await userUpdatePhoneNumber(data).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onPassword = async (val) => {
    try {
      await userChangePassword(val).unwrap();
      setIsModalOpen(false);
      notification.success({
        message: `Thay đổi ${title} thành công`,
        placement: "bottomRight",
        className: "h-16 ",
      });
    } catch (err) {
      console.log(err);
      message.open({
        type: "error",
        content: `${
          err.data.title === null
            ? err?.data.messages.newPassword
            : err.data.title
        }`,
      });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setOpenOTP(false);
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
        title={`Đổi ${title.toLowerCase()}`}
        forceRender
      >
        {openOTP ? (
          <Form onFinish={onOTP} className="mt-4" form={form}>
            <Form.Item
              name="otp"
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập mã OTP`,
                },
              ]}
            >
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                className="otp-input-phone flex justify-center"
              />
            </Form.Item>
            <p>Mã OTP đã được gửi vào số điện thoại {content}</p>
            {count === 0 ? (
              <a
                className="mb-2 inline-block"
                onClick={() => onUpdatePhone(isNewNumberPhone)}
              >
                Gửi lại mã OTP
              </a>
            ) : (
              <p className="mb-2 text-black1">
                Gửi lại mã OTP sau {count} giây
              </p>
            )}
            <Form.Item className="mb-0 mt-3">
              <div className="flex gap-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mr-2 w-full"
                  size="large"
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  Xác nhận
                </Button>
                <Button onClick={handleCancel} className="w-full" size="large">
                  Hủy
                </Button>
              </div>
            </Form.Item>
          </Form>
        ) : keyName === "password" ? (
          <FormPassword onPassword={onPassword} handleCancel={handleCancel} />
        ) : (
          <Form
            onFinish={keyName === "phoneNumber" ? onUpdatePhone : onFinish}
            className="mt-4"
            form={form}
          >
            <Form.Item
              name={keyName}
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập ${title}`,
                },
              ]}
            >
              <Input size="large" placeholder={`Nhập ${title} ...`} />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex gap-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mr-2 w-full"
                  size="large"
                  loading={isLoadingName || isLoadingPhone || isLoadingPassword || isLoadingEmail || isLoadingAddress}
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

export default UserSetting;
