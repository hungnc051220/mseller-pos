import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetReportByPaymentTypeQuery,
  useGetReportOrderQuery,
  useGetReportOverviewQuery,
  useGetReportQuery,
} from "../../api/reportApiSlice";
import { formatMoney } from "../../utils/common";
import {
  Button,
  DatePicker,
  Statistic,
  Table,
  Tabs,
  Divider,
  List,
  Typography,
  Skeleton,
  Avatar,
  Select,
} from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import CountUp from "react-countup";
import { RiDatabaseLine, RiTakeawayLine } from "react-icons/ri";
import { BiDollar, BiLinkAlt } from "react-icons/bi";
import { AiOutlineQrcode, AiOutlineBank } from "react-icons/ai";
import { TbCash } from "react-icons/tb";
import { ChangedOrders } from "../../components";
import { sortBy } from "lodash";
import { useTranslation } from "react-i18next";
import { CiLocationOn } from "react-icons/ci";
import removeAccents from "vn-remove-accents";
import { useGetFloorsQuery } from "../../api/floorApiSlice";
import {
  MdOutlineDone,
  MdOutlinePayments,
  MdOutlineRoomService,
} from "react-icons/md";
import { BsQrCode } from "react-icons/bs";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const CostRevenueList = () => {
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [dataReportByPaymentType, setDataReportByPaymentType] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dataRevenue, setDataRevenue] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [floorIds, setFloorIds] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [copyPaymentTypes, setCopyPaymentTypes] = useState([]);
  const [serviceMethods, setServiceMethods] = useState([]);

  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").set("hour", 0).set("minute", 0).set("second", 0)
  );
  const [toDate, setToDate] = useState(
    dayjs().set("hour", 23).set("minute", 59).set("second", 59)
  );
  const [reportType, setReportType] = useState(0);

  const { data } =
    reportType === 0
      ? useGetReportQuery(
          {
            branchId: user?.branch?.id,
            fromDate: fromDate.format(),
            toDate: toDate
              .set("hour", 23)
              .set("minute", 59)
              .set("second", 59)
              .format(),
          },
          { refetchOnMountOrArgChange: true }
        )
      : useGetReportOrderQuery(
          {
            branchId: user?.branch?.id,
            fromDate: fromDate.format(),
            toDate: toDate
              .set("hour", 23)
              .set("minute", 59)
              .set("second", 59)
              .format(),
          },
          { refetchOnMountOrArgChange: true }
        );

  const { data: dataPayment } = useGetReportOverviewQuery({
    // defaultDate: 30,
    paymentTypes: copyPaymentTypes,
    serviceMethods,
    floorIds,
    fromDate: fromDate
      ? fromDate
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .format("YYYY-MM-DDTHH:mm:ss[Z]")
      : "",
    toDate: toDate
      ? toDate
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .format("YYYY-MM-DDTHH:mm:ss[Z]")
      : "",
  });
  const { data: dataFloors } = useGetFloorsQuery({});

  const options1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      y: {
        position: "left",
        border: {
          dash: [5, 5],
        },
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          display: true,
          color: "gray",
          font: {
            size: 12,
            style: "normal",
            lineHeight: 2,
          },
        },
      },
      y1: {
        position: "right",
        border: {
          dash: [5, 5],
        },
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
        },
        ticks: {
          beginAtZero: false,
          min: 0,
          stepSize: 1,
          callback: function (value) {
            return `${value}`;
          },
          display: true,
          color: "gray",
          font: {
            size: 12,
            style: "normal",
            lineHeight: 2,
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          border: {
            dash: [5, 5],
          },
        },
        ticks: {
          display: true,
          color: "#gray",
          padding: 20,
          font: {
            size: 12,
            style: "normal",
            lineHeight: 2,
          },
        },
      },
    },
  };

  const data1 = {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: dataRevenue,
        tension: 0.4,
        pointRadius: 0,
        borderColor: "#0985CB",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 230, 0, 50);
          gradient.addColorStop(1, "rgba(94, 114, 228, 0.2)");
          gradient.addColorStop(0.2, "rgba(94, 114, 228, 0.0)");
          gradient.addColorStop(0, "rgba(94, 114, 228, 0)");
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        maxBarThickness: 6,
        yAxisID: "y",
      },
      {
        label: "Đơn hàng",
        data: dataOrder,
        tension: 0.4,
        pointRadius: 0,
        borderColor: "#FCC73F",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 230, 0, 50);
          gradient.addColorStop(1, "rgba(255, 179, 179, 0.2)");
          gradient.addColorStop(0.2, "rgba(255, 179, 179, 0.0)");
          gradient.addColorStop(0, "rgba(255, 179, 179, 0)");
          return gradient;
        },
        borderWidth: 3,
        fill: false,
        maxBarThickness: 6,
        yAxisID: "y1",
      },
    ],
  };

  useEffect(() => {
    if (dataPayment) {
      const getLabelDates = dataPayment.reportByDayResponses.map((date) => {
        const day1 = dayjs(fromDate).format("DD/MM/YYYY");
        const day2 = dayjs(toDate).format("DD/MM/YYYY");
        if (day1 === day2) {
          return dayjs(date.id).format("HH:mm");
        }
        return dayjs(date.id).format("DD/MM");
      });
      setLabels(getLabelDates);

      const getDataRevenue = dataPayment.reportByDayResponses.map(
        (value) => value.totalNetPrice
      );
      setDataRevenue(getDataRevenue);

      const getDataOrder = dataPayment.reportByDayResponses.map(
        (value) => value.totalOrder
      );
      setDataOrder(getDataOrder);
    }
  }, [dataPayment]);

  const formatter = (value) => (
    <CountUp
      end={value}
      duration={1}
      separator=","
      suffix={reportType === 0 ? "đ" : " đơn"}
    />
  );

  const dataChart = {
    labels:
      reportType === 0
        ? ["Tiền mặt", "QR động", "QR tĩnh", "Deeplink", "Khác"]
        : ["Tiền mặt", "QR động", "QR tĩnh", "Deeplink", "Khác"],
    datasets: [
      {
        data:
          reportType === 0
            ? [
                data?.turnoverCash,
                data?.turnoverQrcode,
                data?.turnoverQrStatic,
                data?.turnoverDeeplink,
                data?.turnoverOther,
              ]
            : [
                data?.totalOrderCash,
                data?.totalOrderQrcode,
                data?.totalOrderQrStatic,
                data?.totalOrderDeeplink,
                data?.totalOrderOther,
              ],
        backgroundColor: ["#f97316", "#4338ca", "#16a34a", "purple", "#2563eb"],
      },
    ],
  };

  const columns = [
    {
      key: "name",
      title: "Sản phẩm",
      dataIndex: "name",
      render: (text, _) => {
        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <img
              src={_.image}
              alt="image"
              className="h-[21px] w-[24px] rounded-[4px] object-cover"
            />
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      key: "price",
      title: "Giá",
      dataIndex: "price",
      render: (text) => `${formatMoney(text)} đ`,
      align: "right",
    },
    {
      key: "quantity",
      title: "Số lượng bán",
      dataIndex: "quantity",
      align: "center",
    },
    {
      key: "totalTurnover",
      title: "Doanh thu",
      dataIndex: "totalTurnover",
      render: (text) => `${formatMoney(text)} đ`,
      align: "right",
    },
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: window.innerWidth > 640 ? "right" : "bottom",
        align: window.innerWidth > 640 ? "center" : "start",
      },
    },
  };

  const onChangeDate = (date, dateString) => {
    setFromDate(date[0]);
    setToDate(date[1]);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Báo cáo</h1>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Báo cáo danh thu, đơn hàng",
            children: (
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-x-2 rounded-lg border border-gray-200 p-1">
                    <Button
                      type={reportType === 0 ? "primary" : null}
                      onClick={() => setReportType(0)}
                    >
                      Doanh thu
                    </Button>
                    <Button
                      type={reportType === 1 ? "primary" : null}
                      onClick={() => setReportType(1)}
                    >
                      Đơn hàng
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      style={{
                        width: 250,
                      }}
                      allowClear
                      showSearch
                      mode="multiple"
                      maxTagCount="responsive"
                      value={floorIds}
                      onChange={(value) => setFloorIds(value)}
                      placeholder={
                        <div className="flex items-center">
                          <CiLocationOn size={16} />
                          &nbsp;Chọn tầng
                        </div>
                      }
                      options={dataFloors?.floors?.map((floor) => ({
                        value: floor.id,
                        label: (
                          <div className="flex items-center">
                            <CiLocationOn size={16} />
                            &nbsp;{floor.name}
                          </div>
                        ),
                      }))}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        removeAccents(option?.label ?? "")
                          .toLowerCase()
                          .includes(removeAccents(input.toLowerCase()))
                      }
                    />
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
                        setCopyPaymentTypes(bodyPayment);
                        setPaymentTypes(value);
                      }}
                      placeholder={
                        <div className="flex items-center">
                          <MdOutlinePayments size={16} />
                          &nbsp;Chọn hình thức thanh toán
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
                      value={serviceMethods}
                      onChange={(value) => setServiceMethods(value)}
                      placeholder={
                        <div className="flex items-center">
                          <MdOutlineRoomService size={16} />
                          &nbsp;Chọn hình thức phục vụ
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
                    <RangePicker
                      className="w-[360px]"
                      defaultValue={[fromDate, toDate]}
                      format={dateFormatList}
                      onChange={onChangeDate}
                      value={[fromDate, toDate]}
                    />
                  </div>
                </div>

                <div
                  className="mt-4 grid gap-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(300px, 1fr) )",
                  }}
                >
                  <div className="-sm-sm flex flex-wrap items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <h3 className="whitespace-nowrap text-lg text-black1">
                        {reportType === 0
                          ? "Tổng doanh thu"
                          : "Tổng số đơn hàng"}
                      </h3>
                      <Statistic
                        value={
                          reportType === 0 ? data?.turnover : data?.totalOrder
                        }
                        formatter={formatter}
                        valueStyle={{
                          fontSize: 30,
                          fontWeight: "700",
                          whiteSpace: "no-wrap",
                        }}
                      />
                    </div>
                    <div className="flex h-12 min-w-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-500">
                      <RiDatabaseLine color="white" size={20} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div>
                      <h3 className="whitespace-nowrap text-lg text-black1">
                        {reportType === 0
                          ? "Doanh thu tiền mặt"
                          : "Thanh toán tiền mặt"}
                      </h3>
                      <Statistic
                        value={
                          reportType === 0
                            ? data?.turnoverCash
                            : data?.totalOrderCash
                        }
                        formatter={formatter}
                        valueStyle={{
                          fontSize: 30,
                          fontWeight: "700",
                          whiteSpace: "no-wrap",
                        }}
                      />
                    </div>
                    <div className="flex h-12 min-w-[48px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                      <BiDollar color="white" size={20} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div>
                      <h3 className="whitespace-nowrap text-lg text-black1">
                        {reportType === 0
                          ? "Doanh thu chuyển khoản"
                          : "Thanh toán chuyển khoản"}
                      </h3>
                      {reportType === 0 ? (
                        <Statistic
                          value={
                            data?.turnoverQrStatic +
                            data?.turnoverDeeplink +
                            data?.turnoverQrcode
                          }
                          formatter={formatter}
                          valueStyle={{
                            fontSize: 30,
                            fontWeight: "700",
                            whiteSpace: "no-wrap",
                          }}
                        />
                      ) : (
                        <p className="text-[30px] font-bold">
                          {data?.totalOrderQrStatic +
                            data?.totalOrderDeeplink +
                            data?.totalOrderQrcode || 0}{" "}
                          đơn
                        </p>
                      )}
                    </div>
                    <div className="flex h-12 min-w-[48px] items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600">
                      <TbCash color="white" size={20} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div>
                      <h3 className="whitespace-nowrap text-lg text-black1">
                        {reportType === 0
                          ? "Doanh thu khác"
                          : "Thanh toán khác"}
                      </h3>
                      {reportType === 0 ? (
                        <Statistic
                          value={data?.turnoverOther}
                          formatter={formatter}
                          valueStyle={{
                            fontSize: 30,
                            fontWeight: "700",
                            whiteSpace: "no-wrap",
                          }}
                        />
                      ) : (
                        <p className="text-[30px] font-bold">
                          {data?.totalOrderOther || 0} đơn
                        </p>
                      )}
                    </div>
                    <div className="flex h-12 min-w-[48px] items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                      <TbCash color="white" size={20} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-[400px] w-full rounded-lg border border-gray-200 p-4 shadow-sm">
                  <h4 className="mb-2 text-base font-semibold text-gray-500">
                    Thống kê theo doanh thu/ Đơn hàng
                  </h4>
                  <Line options={options1} data={data1} />
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="w-full overflow-hidden rounded-lg border border-gray-200 p-4 shadow-sm lg:w-2/3">
                    <h4 className="mb-4 text-base font-semibold text-gray-500">
                      Món bán chạy
                    </h4>
                    <Table
                      rowKey={(record) => `${record.id}`}
                      dataSource={data?.bestSelling}
                      columns={columns}
                      pagination={false}
                      scroll={{ x: "max-content" }}
                      bordered
                    />
                  </div>
                  <div className="flex flex-1 flex-col rounded-lg border border-gray-200 p-2 shadow-sm md:p-4">
                    <h4 className="mb-4 text-base font-semibold text-gray-500">
                      Biểu đồ theo {reportType === 0 ? "Doanh thu" : "Đơn hàng"}
                    </h4>
                    <div className="flex flex-1 items-center justify-center p-4">
                      <Pie data={dataChart} options={options} />
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          { key: "2", label: "Nhật ký sửa, xoá", children: <ChangedOrders /> },
        ]}
      />
    </div>
  );
};

export default CostRevenueList;
