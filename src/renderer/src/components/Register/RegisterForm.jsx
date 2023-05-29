import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AiOutlineCreditCard,
  AiOutlineLock,
  AiOutlineUser,
} from "react-icons/ai";
import { BiStore } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useRegisterAccountMutation,
} from "../../api/authApiSlice";

const RegisterForm = ({ phoneNumber }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState(null);
  const [registerAccount, { isLoading }] = useRegisterAccountMutation();
  
  useEffect(() => {
    if(!accountNumber) return;
    const getAccountNumber = async () => {
      try {
        const response = await axios.get(`${import.meta.env.RENDERER_VITE_API_URL}/payment/account-info?accountNumber=${accountNumber}`);
        form.setFieldValue("bankAccountName", response.data.data);
      } catch (error) {
        toast.error(error?.response?.data?.title);
        form.setFieldValue("bankAccountName", null);
      }
    }
    getAccountNumber();
  }, [accountNumber])
  

  const onRegister = async (values) => {
    try {
      await registerAccount({ ...values, phoneNumber }).unwrap();
      notification.success({
        message: "Đăng ký thành công",
        description: (
          <p>
            Xin chúc mừng, tài khoản của bạn đã được đăng ký thành công. Hãy
            đăng nhập để trải nghiệm mSeller nhé!
          </p>
        ),
        placement: "top",
      });
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onRegister}
      layout="vertical"
      autoComplete="off"
      scrollToFirstError
    >
      <Form.Item
        label={
          <p className="text-base font-bold text-black1">{t("companyName")}</p>
        }
        name="companyName"
        rules={[
          {
            required: true,
            message: t("message.validation.required", {
              field: t("companyName"),
            }),
          },
          {
            min: 3,
            message: "Tên cửa hàng tối thiếu 3 ký tự",
          },
          {
            max: 200,
            message: "Tên cửa hàng tối đa 200 ký tự",
          },
        ]}
        hasFeedback
      >
        <Input
          prefix={<AiOutlineUser />}
          placeholder={t("companyName")}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={
          <p className="text-base font-bold text-black1">{t("password")}</p>
        }
        name="password"
        rules={[
          {
            required: true,
            message: t("message.validation.required", {
              field: t("password"),
            }),
          },
          {
            min: 6,
            message: "Mật khẩu tối thiếu 6 ký tự",
          },
          {
            max: 20,
            message: "Mật khẩu tối đa 20 ký tự",
          },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<AiOutlineLock />}
          type="password"
          placeholder={t("password")}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={
          <p className="text-base font-bold text-black1">
            {t("confirmPassword")}
          </p>
        }
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: t("message.validation.required", {
              field: t("confirmPassword"),
            }),
          },
          {
            min: 6,
            message: "Nhập lại mật khẩu tối thiếu 6 ký tự",
          },
          {
            max: 20,
            message: "Nhập lại mật khẩu tối đa 20 ký tự",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Nhập lại mật khẩu không trùng khớp")
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<AiOutlineLock />}
          type="password"
          placeholder={t("confirmPassword")}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={
          <p className="text-base font-bold text-black1">
            {t("bankAccountNumber")}
          </p>
        }
        name="bankAccountNumber"
        rules={[
          {
            required: true,
            message: t("message.validation.required", {
              field: t("bankAccountNumber"),
            }),
          },
        ]}
        hasFeedback
      >
        <Input
          prefix={<AiOutlineCreditCard />}
          placeholder={t("bankAccountNumber")}
          size="large"
          onBlur={(e) => setAccountNumber(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label={
          <p className="text-base font-bold text-black1">
            {t("bankAccountName")}
          </p>
        }
        name="bankAccountName"
        rules={[
          {
            required: true,
            message: t("message.validation.required", {
              field: t("bankAccountName"),
            }),
          },
        ]}
        hasFeedback
      >
        <Input
          prefix={<AiOutlineCreditCard />}
          placeholder={t("bankAccountName")}
          size="large"
          readOnly
        />
      </Form.Item>

      <Form.Item
        label={
          <p className="text-base font-bold text-black1">
            {t("referenceAccount")}
          </p>
        }
        name="referenceAccount"
      >
        <Input
          prefix={<BiStore />}
          placeholder={t("referenceAccount")}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={
          <p className="text-base font-bold text-black1">
            {t("referenceCode")}
          </p>
        }
        name="referenceCode"
      >
        <Input
          prefix={<BiStore />}
          placeholder={t("referenceCode")}
          size="large"
        />
      </Form.Item>

      <Form.Item className="mb-3">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="h-12 w-full bg-primary px-5 font-medium"
          loading={isLoading}
        >
          {t("register")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
