import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Table,
  Tabs,
  Tag,
  Modal,
  Select,
  DatePicker,
} from "antd";
import { HiRefresh } from "react-icons/hi";
import { CiLocationOn, CiMoneyBill, CiSearch } from "react-icons/ci";
import { useGetOrdersQuery } from "../../api/orderApiSlice";
import { classNames, formatMoney } from "../../utils/common";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useGetStaffsQuery } from "../../api/staffApiSlice";
import { useGetFloorsQuery } from "../../api/floorApiSlice";
import removeAccents from "vn-remove-accents";
import { BsPerson, BsQrCode } from "react-icons/bs";
import { SiStatuspal } from "react-icons/si";
import {
  MdOutlineDone,
  MdOutlinePayments,
  MdOutlineRoomService,
} from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import {
  AiOutlineBank,
  AiOutlineCloseCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { RiTakeawayLine } from "react-icons/ri";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const dateFormatList = ["HH:mm:ss DD/MM/YYYY", "HH:mm:ss DD/MM/YY"];

const ListEInvoice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [floorIds, setFloorIds] = useState([]);
  const [tableIds, setTableIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [copyPaymentTypes, setCopyPaymentTypes] = useState([]);
  const [takeAways, setTakeAways] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [onTable, setOnTable] = useState(null);
  const [web, setWeb] = useState(null);
  const [takeAway, setTakeAway] = useState(null);

  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery(
    {
      pageNumber: page,
      pageSize,
      orderStatuses: statuses,
      floorIds,
      employeeIds,
      paymentTypes: copyPaymentTypes,
      onTable,
      web,
      takeAway,
      fromDate: fromDate ? dayjs(fromDate).format() : "",
      toDate: toDate ? dayjs(toDate).format() : "",
    },
    { pollingInterval: 60000 }
  );

  const { data: dataStaffs } = useGetStaffsQuery({});
  const { data: dataFloors } = useGetFloorsQuery({});

  useEffect(() => {
    if (selectedOrder) {
      setOpen(true);
    }
  }, [selectedOrder]);

  const onChangeDate = (date, dateString) => {
    setPage(0);
    if (!date) {
      setFromDate(null);
      setToDate(null);
    }
    setFromDate(date[0]);
    setToDate(date[1]);
  };

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
      title: "Ký hiệu",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Ngày lập",
      key: "createdAt",
      render: (_, data) => {
        return (
          <p>{dayjs(data.logs[0].actionDatetime).format("HH:mm DD/MM/YYYY")}</p>
        );
      },
    },
    {
      title: "Người mua",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, data) => {
        return (
          <p>{data.logs.find((x) => x.action === "CREATED")?.user?.fullName}</p>
        );
      },
      width: "200px",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalNetPrice",
      key: "totalNetPrice",
      render: (text) => formatMoney(text),
      align: "right",
      width: "150px",
    },
    {
      title: "Loại hóa đơn",
      dataIndex: "location",
      key: "location",
      render: (_, data) => {
        return (
          <p>
            {data?.floor?.name} - {data?.table?.name}
          </p>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div
          className={classNames(
            listStatus[text]?.color,
            listStatus[text]?.bgColor,
            "inline-flex w-28 items-center justify-center rounded-xl px-2 py-1 text-sm"
          )}
        >
          {t(text)}
        </div>
      ),
      align: "center",
      width: 120,
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "location",
      key: "location",
      render: (_, data) => {
        return (
          <p>
            {data?.floor?.name} - {data?.table?.name}
          </p>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: () => {
        return <div>...</div>;
      },
    },
  ];

  const columns1 = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      width: "10%"
    },
    {
      title: "Tên nhóm món",
      dataIndex: "name",
      key: "name",
      width: "70%"
    },
    {
      title: "Thuế suất",
      dataIndex: "thue",
      key: "thue",
      width: "10%"
    },
    {
      title: "",
      key: "action",
      render: () => {
        return <div>...</div>;
      },
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

  const onDeleteFilter = () => {
    setFloorIds([]);
    setEmployeeIds([]);
    setPaymentTypes([]);
    setTakeAways([]);
    setStatuses([]);
    setToDate(null);
    setFromDate(null);
    setWeb(null);
    setOnTable(null);
    setTakeAway(null);
    setCopyPaymentTypes([]);
  };

  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: "1",
          label: `Danh sách hóa đơn điện tử`,
          children: (
            <div>
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Select
                    style={{
                      width: 250,
                    }}
                    allowClear
                    mode="multiple"
                    maxTagCount="responsive"
                    value={paymentTypes}
                    onChange={(value) => {
                      let bodyPayment = [];
                      const findBank = value.findIndex((x) => x === "BANK");
                      const findCash = value.findIndex((x) => x === "CASH");
                      const findOther = value.findIndex((x) => x === "OTHER");
                      if (findBank !== -1) {
                        bodyPayment = bodyPayment.concat([
                          "QR_CODE",
                          "DEEPLINK",
                          "QR_STATIC",
                        ]);
                      }
                      if (findCash !== -1) {
                        bodyPayment = bodyPayment.concat(["CASH"]);
                      }
                      if (findOther !== -1) {
                        bodyPayment = bodyPayment.concat(["OTHER"]);
                      }
                      setPage(0);
                      setCopyPaymentTypes(bodyPayment);
                      setPaymentTypes(value);
                    }}
                    placeholder={
                      <div className="flex items-center">
                        <MdOutlinePayments size={16} />
                        &nbsp;Người mua
                      </div>
                    }
                    options={[
                      {
                        value: "CASH",
                        label: (
                          <div className="flex items-center">
                            <MdOutlinePayments size={16} />
                            &nbsp;Tiền mặt
                          </div>
                        ),
                      },
                      {
                        value: "BANK",
                        label: (
                          <div className="flex items-center">
                            <AiOutlineBank size={16} />
                            &nbsp;Chuyển khoản
                          </div>
                        ),
                      },
                      {
                        value: "OTHER",
                        label: (
                          <div className="flex items-center">
                            <AiOutlineBank size={16} />
                            &nbsp;Khác
                          </div>
                        ),
                      },
                    ]}
                  />
                  <Select
                    style={{
                      width: 250,
                    }}
                    allowClear
                    mode="multiple"
                    maxTagCount="responsive"
                    value={takeAways}
                    onChange={(value) => {
                      setPage(0);
                      const findOnTable = value.findIndex(
                        (x) => x === "ON_TABLE"
                      );
                      if (findOnTable !== -1) {
                        setOnTable(true);
                      } else {
                        setOnTable(null);
                      }

                      const findImenu = value.findIndex((x) => x === "IMENU");
                      if (findImenu !== -1) {
                        setWeb(true);
                      } else {
                        setWeb(null);
                      }

                      const findTakeAway = value.findIndex(
                        (x) => x === "TAKE_AWAY"
                      );
                      if (findTakeAway !== -1) {
                        setTakeAway(true);
                      } else {
                        setTakeAway(null);
                      }

                      setTakeAways(value);
                    }}
                    placeholder={
                      <div className="flex items-center">
                        <MdOutlineRoomService size={16} />
                        &nbsp;Chọn loại hóa đơn
                      </div>
                    }
                    options={[
                      {
                        value: "ON_TABLE",
                        label: (
                          <div className="flex items-center">
                            <MdOutlineRoomService size={16} />
                            &nbsp;Tại bàn
                          </div>
                        ),
                      },
                      {
                        value: "TAKE_AWAY",
                        label: (
                          <div className="flex items-center">
                            <RiTakeawayLine size={16} />
                            &nbsp;Mang đi
                          </div>
                        ),
                      },
                      {
                        value: "IMENU",
                        label: (
                          <div className="flex items-center">
                            <BsQrCode size={14} />
                            &nbsp;iMenu
                          </div>
                        ),
                      },
                    ]}
                  />

                  <Select
                    style={{
                      width: 250,
                    }}
                    allowClear
                    mode="multiple"
                    maxTagCount="responsive"
                    value={statuses}
                    onChange={(value) => {
                      setPage(0);
                      setStatuses(value);
                    }}
                    placeholder={
                      <div className="flex items-center">
                        <SiStatuspal size={16} />
                        &nbsp;Chọn trạng thái
                      </div>
                    }
                    options={[
                      {
                        value: "WAITING",
                        label: (
                          <div className="flex items-center gap-1 text-orange-500">
                            <AiOutlineLoading3Quarters
                              size={12}
                              color="orange"
                            />
                            &nbsp;Chờ xác nhận
                          </div>
                        ),
                      },
                      {
                        value: "CREATED",
                        label: (
                          <div className="flex items-center text-blue-500">
                            <MdOutlineRoomService size={16} />
                            &nbsp;Đang xử lý
                          </div>
                        ),
                      },
                      {
                        value: "COMPLETED",
                        label: (
                          <div className="flex items-center text-green-500">
                            <MdOutlineDone size={16} color="green" />
                            &nbsp;Hoàn thành
                          </div>
                        ),
                      },
                      {
                        value: "CANCELLED",
                        label: (
                          <div className="flex items-center text-red-500">
                            <AiOutlineCloseCircle size={16} color="red" />
                            &nbsp;Đã huỷ
                          </div>
                        ),
                      },
                    ]}
                  />

                  <RangePicker
                    className="w-[360px]"
                    format={(value) => value.format("HH:mm DD/MM/YYYY")}
                    defaultValue={[null, null]}
                    onChange={onChangeDate}
                    value={[fromDate, toDate]}
                    showTime
                    allowClear
                    placeholder={["Ngày bắt đầu lập", "Ngày kết thúc lập"]}
                  />
                  <Button type="primary" onClick={onDeleteFilter}>
                    Xoá bộ lọc
                  </Button>
                </div>
                <Table
                  dataSource={data?.content}
                  rowSelection
                  columns={columns}
                  scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
                  rowClassName={(record, index) => {
                    return classNames(
                      index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    );
                  }}
                  rowKey={(record) => `${record.id}`}
                  loading={isLoading || isFetching}
                  //   onRow={(record) => ({
                  //     onClick: () => {
                  //       if (
                  //         record.status !== "COMPLETED" &&
                  //         record.status !== "CANCELLED"
                  //       ) {
                  //         navigate(`/orders/edit`, {
                  //           state: {
                  //             background: location,
                  //             orderId: record.id,
                  //             tableId: record?.table?.id,
                  //             tableName: record?.table?.name,
                  //             floorId: record?.floor?.id,
                  //             floorName: record?.floor?.name,
                  //           },
                  //         });
                  //       } else {
                  //         navigate(`/orders/${record.id}`, {
                  //           state: { background: location },
                  //         });
                  //       }
                  //     },
                  //   })}
                  pagination={{
                    simple: window.innerWidth > 640 ? false : true,
                    current: page + 1,
                    pageSize,
                    pageSizeOptions: [20, 50, 100],
                    total: data?.totalElements,
                    onChange: onChangePage,
                    showTotal: (total, range) =>
                      `Hiển thị ${range[0]} đến ${range[1]} của ${total} bản ghi`,
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          key: "2",
          label: `Danh sách thuế suất`,
          children: (
            <div>
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Select
                    style={{
                      width: 250,
                    }}
                    allowClear
                    mode="multiple"
                    maxTagCount="responsive"
                    value={paymentTypes}
                    onChange={(value) => {
                      let bodyPayment = [];
                      const findBank = value.findIndex((x) => x === "BANK");
                      const findCash = value.findIndex((x) => x === "CASH");
                      const findOther = value.findIndex((x) => x === "OTHER");
                      if (findBank !== -1) {
                        bodyPayment = bodyPayment.concat([
                          "QR_CODE",
                          "DEEPLINK",
                          "QR_STATIC",
                        ]);
                      }
                      if (findCash !== -1) {
                        bodyPayment = bodyPayment.concat(["CASH"]);
                      }
                      if (findOther !== -1) {
                        bodyPayment = bodyPayment.concat(["OTHER"]);
                      }
                      setPage(0);
                      setCopyPaymentTypes(bodyPayment);
                      setPaymentTypes(value);
                    }}
                    placeholder={
                      <div className="flex items-center">
                        <MdOutlinePayments size={16} />
                        &nbsp;Người mua
                      </div>
                    }
                    options={[
                      {
                        value: "CASH",
                        label: (
                          <div className="flex items-center">
                            <MdOutlinePayments size={16} />
                            &nbsp;Tiền mặt
                          </div>
                        ),
                      },
                      {
                        value: "BANK",
                        label: (
                          <div className="flex items-center">
                            <AiOutlineBank size={16} />
                            &nbsp;Chuyển khoản
                          </div>
                        ),
                      },
                      {
                        value: "OTHER",
                        label: (
                          <div className="flex items-center">
                            <AiOutlineBank size={16} />
                            &nbsp;Khác
                          </div>
                        ),
                      },
                    ]}
                  />
                  <Select
                    style={{
                      width: 250,
                    }}
                    allowClear
                    mode="multiple"
                    maxTagCount="responsive"
                    value={takeAways}
                    onChange={(value) => {
                      setPage(0);
                      const findOnTable = value.findIndex(
                        (x) => x === "ON_TABLE"
                      );
                      if (findOnTable !== -1) {
                        setOnTable(true);
                      } else {
                        setOnTable(null);
                      }

                      const findImenu = value.findIndex((x) => x === "IMENU");
                      if (findImenu !== -1) {
                        setWeb(true);
                      } else {
                        setWeb(null);
                      }

                      const findTakeAway = value.findIndex(
                        (x) => x === "TAKE_AWAY"
                      );
                      if (findTakeAway !== -1) {
                        setTakeAway(true);
                      } else {
                        setTakeAway(null);
                      }

                      setTakeAways(value);
                    }}
                    placeholder={
                      <div className="flex items-center">
                        <MdOutlineRoomService size={16} />
                        &nbsp;Chọn loại hóa đơn
                      </div>
                    }
                    options={[
                      {
                        value: "ON_TABLE",
                        label: (
                          <div className="flex items-center">
                            <MdOutlineRoomService size={16} />
                            &nbsp;Tại bàn
                          </div>
                        ),
                      },
                      {
                        value: "TAKE_AWAY",
                        label: (
                          <div className="flex items-center">
                            <RiTakeawayLine size={16} />
                            &nbsp;Mang đi
                          </div>
                        ),
                      },
                      {
                        value: "IMENU",
                        label: (
                          <div className="flex items-center">
                            <BsQrCode size={14} />
                            &nbsp;iMenu
                          </div>
                        ),
                      },
                    ]}
                  />

                  <Select
                    style={{
                      width: 250,
                    }}
                    allowClear
                    mode="multiple"
                    maxTagCount="responsive"
                    value={statuses}
                    onChange={(value) => {
                      setPage(0);
                      setStatuses(value);
                    }}
                    placeholder={
                      <div className="flex items-center">
                        <SiStatuspal size={16} />
                        &nbsp;Chọn trạng thái
                      </div>
                    }
                    options={[
                      {
                        value: "WAITING",
                        label: (
                          <div className="flex items-center gap-1 text-orange-500">
                            <AiOutlineLoading3Quarters
                              size={12}
                              color="orange"
                            />
                            &nbsp;Chờ xác nhận
                          </div>
                        ),
                      },
                      {
                        value: "CREATED",
                        label: (
                          <div className="flex items-center text-blue-500">
                            <MdOutlineRoomService size={16} />
                            &nbsp;Đang xử lý
                          </div>
                        ),
                      },
                      {
                        value: "COMPLETED",
                        label: (
                          <div className="flex items-center text-green-500">
                            <MdOutlineDone size={16} color="green" />
                            &nbsp;Hoàn thành
                          </div>
                        ),
                      },
                      {
                        value: "CANCELLED",
                        label: (
                          <div className="flex items-center text-red-500">
                            <AiOutlineCloseCircle size={16} color="red" />
                            &nbsp;Đã huỷ
                          </div>
                        ),
                      },
                    ]}
                  />

                  <RangePicker
                    className="w-[360px]"
                    format={(value) => value.format("HH:mm DD/MM/YYYY")}
                    defaultValue={[null, null]}
                    onChange={onChangeDate}
                    value={[fromDate, toDate]}
                    showTime
                    allowClear
                    placeholder={["Ngày bắt đầu lập", "Ngày kết thúc lập"]}
                  />
                  <Button type="primary" onClick={onDeleteFilter}>
                    Xoá bộ lọc
                  </Button>
                </div>
                <Table
                  dataSource={[]}
                  rowSelection
                  columns={columns1}
                  scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
                  rowClassName={(record, index) => {
                    return classNames(
                      index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    );
                  }}
                  rowKey={(record) => `${record.id}`}
                  loading={isLoading || isFetching}
                  tableLayout="auto"
                  //   onRow={(record) => ({
                  //     onClick: () => {
                  //       if (
                  //         record.status !== "COMPLETED" &&
                  //         record.status !== "CANCELLED"
                  //       ) {
                  //         navigate(`/orders/edit`, {
                  //           state: {
                  //             background: location,
                  //             orderId: record.id,
                  //             tableId: record?.table?.id,
                  //             tableName: record?.table?.name,
                  //             floorId: record?.floor?.id,
                  //             floorName: record?.floor?.name,
                  //           },
                  //         });
                  //       } else {
                  //         navigate(`/orders/${record.id}`, {
                  //           state: { background: location },
                  //         });
                  //       }
                  //     },
                  //   })}
                  pagination={{
                    simple: window.innerWidth > 640 ? false : true,
                    current: page + 1,
                    pageSize,
                    pageSizeOptions: [20, 50, 100],
                    total: data?.totalElements,
                    onChange: onChangePage,
                    showTotal: (total, range) =>
                      `Hiển thị ${range[0]} đến ${range[1]} của ${total} bản ghi`,
                  }}
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default ListEInvoice;
