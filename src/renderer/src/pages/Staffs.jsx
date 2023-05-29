import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, Table, Tabs, Tag, Modal, Avatar } from "antd";
import { HiRefresh } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { useGetStaffsQuery } from "../api/staffApiSlice";
import { useGetOrdersQuery } from "../api/orderApiSlice";
import { classNames, formatMoney, formatPhoneNumber } from "../utils/common";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { BsTrash } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineUserAdd } from "react-icons/ai";
import { StaffDetail } from "../components";
import { useDebounce } from "../hooks/useDebounce";

const Staffs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTearm = useDebounce(searchTerm, 500);
  const [isAddNew, setIsAddNew] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetStaffsQuery({
    pageNumber: page,
    pageSize,
    fullName: debounceSearchTearm,
  });

  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    if (selectedOrder) {
      setOpen(true);
    }
  }, [selectedOrder]);

  const onChange = (key) => {};

  const getTotal = (list) => {
    return list.reduce((total, item) => (total += item.quantity), 0);
  };

  const listStatus = {
    WAITING: { color: "text-[#54007B]", bgColor: "bg-[#ECDEF2]" },
    CREATED: { color: "text-[#E58C05]", bgColor: "bg-[#FFE9C9]" },
    COMPLETED: { color: "text-[#02C081]", bgColor: "bg-[#E1FFF7]" },
    CANCELLED: { color: "text-[#E13641]", bgColor: "bg-[#FFE2E2]" },
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, { avatar }) => {
        return (
          <div className="flex items-center justify-start gap-1">
            {_ ? <Avatar src={avatar} /> : <Avatar shape="round" />}
            {_}
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => formatPhoneNumber(text),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_) => dayjs(_).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Quyền",
      dataIndex: "roles",
      key: "roles",
      render: (data) => data[0]?.name,
    },
  ];

  const onChangePage = (page, pageSize) => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="">
      <h1 className="text-3xl font-semibold">Danh sách nhân viên</h1>
      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <Input
            placeholder="Nhập tên nhân viên..."
            prefix={<CiSearch size={20} />}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <Button
            type="primary"
            className="flex items-center justify-center gap-2"
            icon={<AiOutlineUserAdd size={16} />}
            loading={isLoading || isFetching}
            onClick={() => setIsAddNew(true)}
          >
            Thêm nhân viên
          </Button>
        </div>
        <Table
          dataSource={data?.content}
          columns={columns}
          scroll={{ x: "max-content", y: "calc(100vh - 380px)" }}
          rowClassName={(record, index) => {
            return classNames(
              index % 2 === 0 ? "table-row-light" : "table-row-dark",
              "cursor-pointer"
            );
          }}
          rowKey={(record) => `${record.id}`}
          loading={isLoading || isFetching}
          onRow={(record) => ({
            onClick: () => setSelectedStaff(record.id),
          })}
          pagination={{
            simple: window.innerWidth > 640 ? false : true,
            current: page + 1,
            pageSize,
            pageSizeOptions: [20, 50, 100],
            total: data?.totalElements,
            onChange: onChangePage,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} nhân viên`,
            hideOnSinglePage: true,
          }}
        />
      </div>

      {(isAddNew || selectedStaff) && (
        <StaffDetail
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          isAddNew={isAddNew}
          setIsAddNew={setIsAddNew}
        />
      )}
    </div>
  );
};

export default Staffs;
