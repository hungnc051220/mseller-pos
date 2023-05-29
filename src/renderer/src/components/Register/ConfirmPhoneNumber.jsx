import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { BiPhoneCall } from "react-icons/bi";
import { useGenerateOtpMutation, useVerifyPhoneNumberMutation } from "../../api/authApiSlice";

const ConfirmPhoneNumber = ({
  setToken,
  setPhoneNumber,
  setStep,
  isForgotPassword,
}) => {
  const [form] = Form.useForm();

  const [verifyPhoneNumber, { isLoading }] = useVerifyPhoneNumberMutation(
    isForgotPassword ? skipToken : ""
  );
  const [generateOtp, { isLoading: isLoadingGenerateOtp }] =
    useGenerateOtpMutation(!isForgotPassword ? skipToken : "");

  const [error, setError] = useState({
    enable: false,
    helpText: "",
  });

  useEffect(() => {
    if (error.enable) {
      form.validateFields();
    }
  }, [error]);

  const onVerifyPhoneNumber = async (values) => {
    try {
      let response;
      if (isForgotPassword) {
        response = await generateOtp({
          phoneNumber: values.phoneNumber,
        }).unwrap();
      } else {
        response = await verifyPhoneNumber({
          phoneNumber: values.phoneNumber,
        }).unwrap();
      }
      setPhoneNumber(values.phoneNumber);
      setToken(response.token);
      setStep((prev) => prev + 1);
    } catch (error) {
      const message = error?.data?.messages?.phoneNumber?.[0] || "";
      setError({
        enable: true,
        helpText: message,
      });
    }
  };

  return (
    <Form
      form={form}
      onFinish={onVerifyPhoneNumber}
      layout="vertical"
      onChange={() => {
        if (error.enable) {
          setError({ enable: false, helpText: "" });
        }
      }}
      requiredMark="optional"
    >
      <Form.Item
        label={
          <p className="text-base font-bold text-black1">Số điện thoại</p>
        }
        name="phoneNumber"
        rules={[
          {
            required: true,
            message: "Số điện thoại không được để trống",
          },
          {
            pattern: "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4}$",
            message: "Số điện thoại không hợp lệ",
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
          prefix={<BiPhoneCall />}
          placeholder="Số điện thoại"
          size="large"
          maxLength={10}
        />
      </Form.Item>

      <Form.Item className="mb-3">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading || isLoadingGenerateOtp}
        >
          Tiếp tục
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConfirmPhoneNumber;
