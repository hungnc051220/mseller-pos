import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  useChangePasswordMutation,
  useConfirmPhoneNumberMutation,
} from "@/api/authApiSlice";

const VerifyNumber = ({ phoneNumber, token, setStep, isForgotPassword }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();


  const [confirmPhoneNumber, { isLoading }] = useConfirmPhoneNumberMutation();
  const [changePassword, { isLoading: isLoadingChangePassword }] =
    useChangePasswordMutation();

  const [count, setCount] = useState(60);
  const [error, setError] = useState({
    enable: false,
    helpText: "",
  });

  useEffect(() => {
    if (error.enable) {
      form.validateFields();
    }
  }, [error]);

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

  const onConfirmPhoneNumber = async (values) => {
    try {
      await confirmPhoneNumber({
        phoneNumber,
        token,
        otp: values.otp,
      });
      setStep((prev) => prev + 1);
    } catch (error) {
      const message = error?.data?.title || "";
      setError({
        enable: true,
        helpText: message,
      });
    }
  };

  const onChangePassword = async (values) => {
    try {
      await changePassword({
        token,
        otp: values.otp,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      }).unwrap();
      message.success("Thay đổi mật khẩu mới thành công. Vui lòng đăng nhập lại!");
      navigate("/auth/login");
    } catch (error) {
      message.error(error?.data?.title || "Thay đổi mật khẩu mới thất bại");
    }
  };

  return (
    <Form
      form={form}
      onFinish={isForgotPassword ? onChangePassword : onConfirmPhoneNumber}
      layout="vertical"
      requiredMark="optional"
      onChange={() => {
        if (error.enable) {
          setError({ enable: false, helpText: "" });
        }
      }}
    >
      <Form.Item
        label={<p className="text-base font-bold text-black1">Mã OTP</p>}
        name="otp"
        rules={[
          {
            required: true,
            message: "Mã OTP không được để trống",
          },
          () => ({
            validator() {
              if (error.enable) {
                return Promise.reject(error.helpText);
              }
              return Promise.resolve();
            },
          }),
        ]}
        hasFeedback
      >
        <Input
          prefix={<AiOutlineUser />}
          placeholder="Nhập mã OTP"
          size="large"
          maxLength={6}
        />
      </Form.Item>
      {isForgotPassword && (
        <>
          <Form.Item
            label={
              <p className="text-base font-bold text-black1">
                Mật khẩu mới
              </p>
            }
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Mật khẩu mới không được để trống"
              },
              {
                min: 6,
                message: "Mật khẩu mới tối thiếu 6 ký tự",
              },
              {
                max: 20,
                message: "Mật khẩu mới tối đa 20 ký tự",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<AiOutlineLock />}
              type="password"
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={
              <p className="text-base font-bold text-black1">
                {t("confirmNewPassword")}
              </p>
            }
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Mật khẩu mới không được để trống"
              },
              {
                min: 6,
                message: "Nhập lại mật khẩu mới tối thiếu 6 ký tự",
              },
              {
                max: 20,
                message: "Nhập lại mật khẩu mới tối đa 20 ký tự",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Nhập lại mật khẩu mới không trùng khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<AiOutlineLock />}
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              size="large"
            />
          </Form.Item>
        </>
      )}
      {count === 0 ? (
        <a className="mb-2 inline-block">Gửi lại mã OTP</a>
      ) : (
        <p className="mb-2 text-black1">
          Mã OTP sẽ được gửi tới bạn trong {count} giây
        </p>
      )}

      <Form.Item className="mb-2">
        <div className="space-y-2">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading || isLoadingChangePassword}
          >
            Xác nhận
          </Button>

          {!isForgotPassword && (
            <Button
              htmlType="submit"
              size="large"
              block
              onClick={() => setStep((prev) => prev - 1)}
            >
              {t("useAnotherPhone")}
            </Button>
          )}
        </div>
      </Form.Item>
    </Form>
  );
};

export default VerifyNumber;
