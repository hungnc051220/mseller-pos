import React, { useEffect, useState } from "react";
import {
  Button,
  Upload,
  Avatar,
  Tabs,
  List,
  notification,
  Spin,
  Modal,
  Form,
} from "antd";
import { FiPhoneCall } from "react-icons/fi";
import { GoLocation } from "react-icons/go";
import { ImQrcode } from "react-icons/im";
import {
  useDeleteUserMutation,
  useGenerateOtpDeleteMutation,
  useGetUserQuery,
} from "../api/userApiSlice";
import { UserSetting, PaymentSetting } from "../components";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { CiBank, CiBarcode } from "react-icons/ci";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { BsKey } from "react-icons/bs";
import { apiSlice } from "../api/apiSlice";
import OTPInput from "otp-input-react";
import { logOut } from "../features/auth/authSlice";

const TabUser = ({ dataUser, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Spin spinning={isLoading}>
      <div className="cursor-pointer overflow-hidden bg-white shadow sm:rounded-md">
        <List>
          <UserSetting
            icon={
              <AiOutlineUser
                className="mr-1.5 flex-shrink-0 text-gray-400"
                size={25}
              />
            }
            title="Họ tên"
            content={dataUser?.fullName}
            keyName="fullName"
            dataUser={dataUser}
          />
          <UserSetting
            icon={
              <FiPhoneCall
                className="mr-1.5 flex-shrink-0 text-gray-400"
                size={25}
              />
            }
            title="Số điện thoại"
            content={dataUser?.phoneNumber}
            keyName="phoneNumber"
            dataUser={dataUser}
          />
          <UserSetting
            icon={
              <BsKey className="mr-1.5 flex-shrink-0 text-gray-400" size={25} />
            }
            title="Mật khẩu"
            content="********"
            keyName="password"
            dataUser={dataUser}
          />
          <UserSetting
            icon={
              <AiOutlineMail
                className="mr-1.5 flex-shrink-0 text-gray-400"
                size={25}
              />
            }
            title="Email"
            content={dataUser?.email}
            keyName="email"
            dataUser={dataUser}
          />
          {/* <UserSetting
          icon={
            <GoLocation
              className="mr-1.5 flex-shrink-0 text-gray-400"
              size={25}
            />
          }
          title="Địa chỉ chi nhánh"
          content={dataUser?.branch?.address}
          keyName="address"
          dataUser={dataUser}
        /> */}
        </List>
      </div>
    </Spin>
  );
};

const TabPayment = ({ dataUser, isLoading }) => {
  return (
    <div className="cursor-pointer overflow-hidden bg-white shadow sm:rounded-md">
      <List>
        <PaymentSetting
          icon={
            <ImQrcode
              className="mr-1.5 flex-shrink-0 text-gray-400"
              size={25}
            />
          }
          title="iMenu QR của tôi"
          keyName='qrimenu'
          onClick={() => setOpen(true)}
        />
        <PaymentSetting
          icon={
            <CiBank className="mr-1.5 flex-shrink-0 text-gray-400" size={25} />
          }
          title="Tài khoản ngân hàng"
          keyName="bank"
          dataUser={dataUser}
        />
        <PaymentSetting
          icon={
            <CiBarcode
              className="mr-1.5 flex-shrink-0 text-gray-400"
              size={25}
            />
          }
          title="QR tĩnh thanh toán"
          keyName='qrstatic'
        />
      </List>
    </div>
  );
};

const Setting = () => {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useGetUserQuery();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openOTP, setOpenOTP] = useState(false);
  const [count, setCount] = useState(60);
  const [form] = Form.useForm();
  const [tokenOTP, setTokenOTP] = useState("");
  const dispatch = useDispatch();

  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();
  const [generateOtpDelete] = useGenerateOtpDeleteMutation();

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

  const onGetOTP = async () => {
    try {
      const response = await generateOtpDelete();
      setTokenOTP(response?.data?.data?.token);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setOpenModalDelete(false);
    setOpenOTP(false);
    form.resetFields();
  };

  const onDeleteAcc = async (values) => {
    const body = {
      otp: values.otp,
      token: tokenOTP,
    };

    try {
      await deleteUser(body).unwrap();
      dispatch(logOut());
      dispatch(apiSlice.util.resetApiState());
    } catch (error) {
      console.log(error);
    }
  };

  const onOTP = () => {
    onGetOTP();
    setOpenModalDelete(true);
    setOpenOTP(true);
    setCount(60);
  };

  const props = {
    name: "image",
    action: `${import.meta.env.RENDERER_VITE_API_URL}/user/update-avatar`,
    headers: {
      authorization: `Bearer ${
        JSON.parse(sessionStorage.getItem("user")).accessToken
      }`,
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === "done") {
        notification.success({
          message: `Thay đổi ảnh đại diện thành công`,
          placement: "bottomRight",
          className: "h-16 ",
        });
        refetch();
      }
    },
  };

  const items = [
    {
      key: "1",
      label: `Thông tin cá nhân`,
      children: <TabUser dataUser={data} isLoading={isLoading} />,
    },
    {
      key: "2",
      label: " Thông tin thanh toán",
      children: <TabPayment dataUser={data} isLoading={isLoading} />,
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="mb-3 text-3xl font-semibold">Cài đặt</h1>
        <div>
          <Button size="large" danger onClick={() => setOpenModalDelete(true)}>
            Xóa tài khoản
          </Button>
          <Modal
            title={<p className="text-lg">Xóa tài khoản</p>}
            open={openModalDelete}
            centered
            okText="Xác nhận"
            okButtonProps={{ danger: true }}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
          >
            {openOTP ? (
              <Form autoComplete="off" onFinish={onDeleteAcc}>
                <p className="mb-3 text-base">Vui lòng nhập mã xác thực</p>
                <Form.Item name="otp">
                  <OTPInput
                    autoFocus
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    className="otp-input-phone flex justify-center"
                  />
                </Form.Item>
                {count === 0 ? (
                  <a className="mb-1 flex justify-center" onClick={onOTP}>
                    Gửi lại mã OTP
                  </a>
                ) : (
                  <p className="mb-1 flex justify-center text-black1">
                    Mã OTP sẽ được gửi lại sau {count} giây
                  </p>
                )}
                <Form.Item className="mb-0 mt-4 flex justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="ml-2"
                    onClick={() => {
                      setOpenOTP(true);
                    }}
                    // loading={isLoadingCancel}
                  >
                    Xác thực
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <div>
                <p>Bạn có chắc chắn muốn xóa tài khoản không?</p>
                <div className="mb-0 mt-4 flex justify-end">
                  <Button onClick={handleCancel}>Huỷ bỏ</Button>
                  <Button
                    type="primary"
                    className="ml-2"
                    danger
                    onClick={onOTP}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
      <div className="container flex flex-col gap-3 md:flex-row">
        <div className="h-96 w-96 flex-initial">
          <div className="flex flex-col items-center justify-center border border-gray-200 bg-white px-4 py-5 sm:pl-6">
            <p className="self-start text-base font-semibold">Ảnh đại diện</p>
            <Avatar size={250} src={data?.avatar} />
            <Upload {...props}>
              <Button
                type="primary"
                style={{
                  marginTop: 16,
                }}
              >
                Tải lên
              </Button>
            </Upload>
          </div>
        </div>

        <div className="flex-auto">
          <div className=" border-gray-200 bg-white px-4  sm:pl-6">
            <div className="-ml-4 -mt-2 ">
              <div className="ml-4 mt-2">
                <Tabs defaultActiveKey="1" type="card" items={items} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
