import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Form, Input, Modal, notification, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetRolesQuery } from "../api/roleApiSlice";
import {
  useAddStaffMutation,
  useDeleteStaffMutation,
  useGetStaffQuery,
  useUpdateStaffMutation,
} from "../api/staffApiSlice";

const { Option } = Select;

const StaffDetail = ({
  selectedStaff,
  setSelectedStaff,
  isAddNew,
  setIsAddNew,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deleteStaff, { isLoading: isLoadingDelete }] =
    useDeleteStaffMutation();

  const { data, isLoading } = useGetStaffQuery(
    selectedStaff ? selectedStaff : skipToken
  );

  const { data: dataRoles } = useGetRolesQuery();
  const user = useSelector((state) => state.auth.user);

  const [updateStaff, { isLoading: isLoadingUpdate }] =
    useUpdateStaffMutation();
  const [addStaff, { isLoading: isLoadingAdd }] = useAddStaffMutation();

  useEffect(() => {
    if (isAddNew || selectedStaff) {
      setIsOpen(true);
    }
  }, [selectedStaff, isAddNew]);

  const handleCancel = () => {
    setSelectedStaff(null);
    setIsOpen(false);
    setIsAddNew(false);
  };

  const onDeleteStaff = async () => {
    try {
      await deleteStaff(selectedStaff).unwrap();
      notification.success({
        message: "Xóa nhân viên",
        description: "Xóa nhân viên thành công!",
        placement: "bottomRight",
      });
      setIsOpenDelete(false);
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  const joinString = (data) => {
    const roles = data?.roles?.map((item) => item.name);
    const rolesName = roles?.join(", ");
    return rolesName;
  };

  useEffect(() => {
    form.setFieldsValue({
      fullName: data?.fullName,
      phoneNumber: data?.phoneNumber,
      //role: joinString(data || []),
      role: data?.roles[0].id,
    });
  }, [data]);

  const onUpdateStaff = async (values) => {
    let body = {
      userId: data?.id,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      branchId: data?.branch?.id,
    };

    if (data?.roles[0].name !== "Chủ cửa hàng") {
      body.roleId = values.role;
    }

    try {
      await updateStaff(body).unwrap();
      notification.success({
        message: "Cập nhật nhân viên",
        description: "Cập nhật nhân viên thành công!",
        placement: "bottomRight",
      });
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  const onAddStaff = async (values) => {
    let body = {
      userId: user?.id,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      branchId: user?.branch?.id,
      password: values.password,
    };

    if (data?.roles[0].name !== "Chủ cửa hàng") {
      body.roleId = values.role;
    }

    try {
      await addStaff(body).unwrap();
      notification.success({
        message: "Thêm nhân viên",
        description: "Thêm nhân viên mới thành công!",
        placement: "bottomRight",
      });
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Đóng"
      onOk={form.submit}
      confirmLoading={isLoadingUpdate}
    >
      <h2 className="mt-8 mb-4 text-center text-xl font-bold">
        {isAddNew ? "Thêm" : "Chi tiết"} nhân viên
      </h2>

      <div className="text-right">
        <Button danger ghost onClick={() => setIsOpenDelete(true)}>
          Xóa
        </Button>
        <Modal
          title="Xóa nhân viên"
          open={isOpenDelete}
          onOk={onDeleteStaff}
          onCancel={() => setIsOpenDelete(false)}
          centered
          okText="Xác nhận"
          okButtonProps={{ danger: true }}
          confirmLoading={isLoadingDelete}
          cancelText="Đóng"
          destroyOnClose
        >
          <p>Bạn có chắc chắn muốn xóa nhân viên này không?</p>
        </Modal>
      </div>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
        layout="horizontal"
        labelAlign="left"
        className="mt-4"
        onFinish={isAddNew ? onAddStaff : onUpdateStaff}
      >
        <Form.Item
          name="fullName"
          label="Tên nhân viên"
          rules={[
            { required: true, message: "Tên nhân viên không được để trống" },
          ]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Số điện thoại không được để trống" },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        {isAddNew && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Mật khẩu không được để trống" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Quyền"
          rules={[{ required: true, message: "Quyền không được để trống" }]}
        >
          {user?.role === "ROLE_COMPANY" ? (
            <Select
              disabled={user?.roleResponse?.id === data?.roles[0].id}
              placeholder="Quyền"
            >
              {dataRoles?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          ) : (
            <Input readOnly />
          )}
        </Form.Item>

        <Form.Item label="Ngày tạo" className={isAddNew ? "hidden" : ""}>
          <Input
            placeholder="Ngày tạo"
            value={dayjs(data?.createdAt).format("HH:mm DD/MM/YYYY")}
            readOnly
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffDetail;
