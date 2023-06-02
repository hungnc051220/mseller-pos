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
  Avatar,
  List,
} from "antd";
import { HiRefresh } from "react-icons/hi";
import { CiLocationOn, CiMoneyBill, CiSearch } from "react-icons/ci";
import { useGetOrdersQuery } from "../api/orderApiSlice";
import { classNames, formatMoney } from "../utils/common";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useGetStaffsQuery } from "../api/staffApiSlice";
import { useGetFloorsQuery } from "../api/floorApiSlice";
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
  AiOutlineSearch,
} from "react-icons/ai";
import { RiTakeawayLine } from "react-icons/ri";
import { icons, images } from "../constants";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const dateFormatList = ["HH:mm:ss DD/MM/YYYY", "HH:mm:ss DD/MM/YY"];
import { listStatus } from "../constants";

const EInvoice = () => {
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

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nhân viên",
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
      title: "Số món",
      dataIndex: "totalFoods",
      key: "totalFoods",
      render: (_, data) => {
        return <p>{getTotal(data.foods)}</p>;
      },
      width: "100px",
    },
    {
      title: "Ngày đặt",
      key: "createdAt",
      render: (_, data) => {
        return (
          <p>{dayjs(data.logs[0].actionDatetime).format("HH:mm DD/MM/YYYY")}</p>
        );
      },
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
      title: "Vị trí",
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
          {listStatus[text]?.text}
        </div>
      ),
      align: "center",
      width: 120,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (text) => (text === "CASH" ? t("CASH") : t("bankTransfer")),
      width: "200px",
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
    <div className="">
      <h1 className="text-3xl font-semibold">Hóa đơn điện tử</h1>
      <Outlet />
    </div>
  );
};

export default EInvoice;
