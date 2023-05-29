import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/authApiSlice";
import { images } from "../constants";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const [isError, setIsError] = useState("");
  const [error, setError] = useState({
    enable: false,
    helpText: "",
  });

  useEffect(() => {
    if (error.enable) {
      form.validateFields();
    }
  }, [error]);

  const onFinish = async (data) => {
    try {
      const userData = await login(data).unwrap();
      dispatch(setCredentials({ ...userData }));
      navigate("/");
    } catch (error) {
      const message =
        error?.data?.title || error?.data?.messages?.phoneNumber?.[0] || "";
      setError({
        enable: true,
        helpText: message,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-start gap-3">
        <img className="h-10 w-10" src={images.logo} alt="logo" />
        <h2 className="text-2xl font-bold text-black1">Đăng nhập</h2>
      </div>
      <div className="mt-8">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
          onChange={() => {
            if (error.enable) {
              setError({ enable: false, helpText: "" });
            }
          }}
        >
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Số điện thoại không được để trống",
              },
              {
                min: 10,
                max: 10,
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
            validateStatus={isError}
          >
            <Input
              prefix={<AiOutlineUser />}
              placeholder="Số điện thoại"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Mật khẩu không được để trống",
              },
              () => ({
                validator() {
                  if (error.enable) {
                    return Promise.reject();
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<AiOutlineLock />}
              type="password"
              placeholder="Mật khẩu"
              size="large"
              onChange={() => setIsError(undefined)}
            />
          </Form.Item>

          <Form.Item className="mb-3">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <div className="flex items-center justify-between">
            <p>
              Chưa có tài khoản?{" "}
              <a onClick={() => navigate("/auth/register")}>
                Đăng ký ngay
              </a>
            </p>
            <a className="text-primary hover:text-primary/70" onClick={() => navigate("/auth/forgot-password")}>
              Quên mật khẩu?
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
