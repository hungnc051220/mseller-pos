import { Button, Form, Input, Modal, notification, Select } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  useDeleteTableMutation,
  useEditTableMutation,
} from "../../../api/tableApiSlice";
import { SlPencil } from "react-icons/sl";
import { FiRefreshCcw } from "react-icons/fi";
import { isArray, mergeWith } from "lodash";
import {
  useChangeTableMutation,
  useGetOrderByTableQuery,
} from "../../../api/orderApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ChangeTable = ({ floors, table, floorId, navigate, location, open, setOpen, order }) => {
  const [form] = Form.useForm();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);

  const [changeTable, { isLoading }] = useChangeTableMutation();
  const [deleteTable, { isLoading: isLoadingDelete }] =
    useDeleteTableMutation();

  const showModal = () => {
    setOpen(true);
  };

  const showModalDelete = () => {
    setIsOpenDelete(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedTable(null);
    setOpen(false);
  };

  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        floorId: order?.floor?.id,
      });
      const listTables = floors
        .find((floor) => floor.id === floorId)
        ?.tables?.filter((table) => table.status !== true);
      setTables(listTables);
    }
  }, [order, open]);

  useEffect(() => {
    if (selectedFloor) {
      form.setFieldValue("tableId", null);
      const listTables = floors
        .find((floor) => floor.id === selectedFloor)
        ?.tables?.filter((table) => table.status !== true);
      setTables(listTables);
    }
  }, [selectedFloor]);

  const handleSubmit = async (values) => {
    try {
      await changeTable({ ...values, orderId: order?.id }).unwrap();
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  return (
    <>
      <Button
        className="border border-blue-500 bg-blue-500 text-white hover:border-blue-400 hover:bg-blue-400 flex-1 max-w-[250px]"
        size="large"
        onClick={() => {
          setSelectedTable(table);
          showModal();
        }}
      >
        Đổi bàn (F3)
      </Button>
      <Modal
        title="Đổi bàn"
        open={open}
        onOk={form.submit}
        okText="Lưu"
        cancelText="Đóng"
        onCancel={handleCancel}
        confirmLoading={isLoading}
        destroyOnClose
      >
        <div className="flex items-center justify-center">
          <p className="rounded-md border border-gray-300 py-1 px-2 font-bold">
            Bàn hiện tại:{" "}
            <span className="text-primary">{order?.table?.name}</span>
          </p>
        </div>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="floorId"
            label="Tầng"
            rules={[
              {
                required: true,
                message: "Tầng không được để trống",
              },
            ]}
          >
            <Select onChange={setSelectedFloor} placeholder="Chọn tầng">
              {floors?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="tableId"
            label="Bàn"
            rules={[
              {
                required: true,
                message: "Bàn không được để trống",
              },
            ]}
          >
            <Select placeholder="Chọn bàn">
              {tables?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangeTable;
