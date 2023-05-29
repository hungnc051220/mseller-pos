import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  useAddCostRevenueMutation,
  useUpdateCostRevenueMutation,
} from "@/api/costRevenue";
import { useGetStaffsQuery } from "@/api/staffApiSlice";
import { useGetCategoryCostRevenueQuery } from "../../api/categoryCostRevenue";

const { TextArea } = Input;

const AddCostRevenue = ({ isEdit, item }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCostRevenue, { isLoading }] = useAddCostRevenueMutation();
  const [updateCostRevenue, { isLoading: isLoadingUpdate }] =
    useUpdateCostRevenueMutation();
  const { data: dataStaffs } = useGetStaffsQuery({
    pageNumber: 0,
    pageSize: 10000,
  });
  const { data: dataCategories } = useGetCategoryCostRevenueQuery({
    pageNumber: 0,
    pageSize: 10000,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (!isEdit) {
      form.resetFields();
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        crType: item.crType,
        createdForUserId: item.createdForUser?.id,
        userPaidId: item.userPaid?.id,
        costRevenueCategoryId: item.costRevenueCategory?.id,
        amount: item.amount,
        content: item.content,
      });
    }
  }, [isEdit]);

  const handleSubmit = async (values) => {
    try {
      await createCostRevenue(values).unwrap();
      toast.success("Tạo phiếu thành công!");
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  const handleUpdateCostRevenue = async (values) => {
    try {
      await updateCostRevenue({ ...values, id: item.id }).unwrap();
      toast.success("Sửa phiếu thành công!");
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  return (
    <>
      {!isEdit ? (
        <Button type="primary" onClick={showModal}>
          +Tạo Thu/Chi
        </Button>
      ) : (
        <BsPencil
          color="blue"
          size={18}
          className="cursor-pointer hover:opacity-70"
          onClick={showModal}
        />
      )}
      <Modal
        title={`${isEdit ? "Sửa" : "Tạo"} phiếu`}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading || isLoadingUpdate}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={isEdit ? handleUpdateCostRevenue : handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="crType"
            label="Loại phiếu"
            rules={[
              {
                required: true,
                message: "Tên loại phiếu không được để trống",
              },
            ]}
          >
            <Select
              options={[
                { label: "Phiếu chi", value: "COST" },
                { label: "Phiếu thu", value: "REVENUE" },
              ]}
              placeholder="Chọn loại phiếu"
            />
          </Form.Item>

          <Form.Item
            name="createdForUserId"
            label="Người tạo phiếu"
            rules={[
              {
                required: true,
                message: "Người tạo phiếu không được để trống",
              },
            ]}
          >
            <Select
              options={dataStaffs?.content?.map((staff) => ({
                label: staff.fullName,
                value: staff.id,
              }))}
              placeholder="Chọn người tạo phiếu"
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) =>
              prevValues.crType !== curValues.crType
            }
          >
            {() => (
              <Form.Item
                name="userPaidId"
                label={form.getFieldValue('crType') === "COST" ? "Người chi tiền" : "Người nộp tiền"}
                rules={[
                  {
                    required: true,
                    message: `Người ${form.getFieldValue('crType') === "COST" ? "chi" : "nộp"} tiền không được để trống`,
                  },
                ]}
              >
                <Select
                  options={dataStaffs?.content?.map((staff) => ({
                    label: staff.fullName,
                    value: staff.id,
                  }))}
                  placeholder={`Chọn người ${form.getFieldValue('crType') === "COST" ? "chi" : "nộp"} tiền`}
                />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item
            name="costRevenueCategoryId"
            label="Khoản mục"
            rules={[
              {
                required: true,
                message: "Khoản mục không được để trống",
              },
            ]}
          >
            <Select
              options={dataCategories?.content?.map((category) => ({
                label: category.content,
                value: category.id,
              }))}
              placeholder="Chọn khoản mục"
            />
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
              min={1}
              className="w-full"
              placeholder="Nhập số tiền"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              max={100000000}
            />
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <TextArea maxLength={50} placeholder="Nhập nội dung" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCostRevenue;
