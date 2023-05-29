import { DatePicker, Select, Statistic, Table, Tabs } from "antd";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import CountUp from "react-countup";
import { useGetChartRevenueQuery } from "@/api/costRevenue";
import { useGetStaffsQuery } from "@/api/staffApiSlice";
import { AddCostRevenue, CategoryCostRevenue } from "@/components";
import { icons } from "@/constants";
import { formatMoney } from "@/utils/common";
import DeleteCostRevenue from "../components/cost-revenue/DeleteCostRevenue";
import { useGetCostRevenueQuery } from "../api/costRevenue";

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
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const Report = () => {
  const [labels, setLabels] = useState([]);
  const [dataRevenue, setDataRevenue] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const { data: dataStaffs } = useGetStaffsQuery({
    pageNumber: 0,
    pageSize: 10000,
  });

  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").set("hour", 0).set("minute", 0).set("second", 0)
  );
  const [toDate, setToDate] = useState(
    dayjs().set("hour", 23).set("minute", 59).set("second", 59)
  );
  const [crType, setCrType] = useState(null);
  const [createdForUser, setCreatedForUser] = useState([]);
  const [userPaid, setUserPaid] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  
  const { data: dataChart, isLoading: isLoadingChartCostRevenue } =
    useGetChartRevenueQuery({
      type: crType,
      createdForUser,
      userPaid,
      fromDate: fromDate
        ? fromDate.set("hour", 0).set("minute", 0).set("second", 0).format()
        : "",
      toDate: toDate
        ? toDate.set("hour", 23).set("minute", 59).set("second", 59).format()
        : "",
    });

    const { data: dataCostRevenue, isLoading: isLoadingCostRevenue } =
    useGetCostRevenueQuery({
      type: crType,
      createdForUser,
      userPaid,
      fromDate: fromDate
        ? fromDate.set("hour", 0).set("minute", 0).set("second", 0).format()
        : "",
      toDate: toDate
        ? toDate.set("hour", 23).set("minute", 59).set("second", 59).format()
        : "",
    });

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
      x: {
        grid: {
          drawBorder: true,
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
        label: "Khoản thu",
        data: dataRevenue,
        tension: 0.4,
        pointRadius: 0,
        borderColor: "#2DB894",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 230, 0, 50);
          gradient.addColorStop(1, "rgba(45, 184, 148, 0.2)");
          gradient.addColorStop(0.2, "rgba(45, 184, 148, 0.0)");
          gradient.addColorStop(0, "rgba(45, 184, 148, 0)");
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        maxBarThickness: 6,
        // yAxisID: "y",
      },
      {
        label: "Khoản chi",
        data: dataOrder,
        tension: 0.4,
        pointRadius: 0,
        borderColor: "#ff0000",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 230, 0, 50);
          gradient.addColorStop(1, "rgba(255, 0, 0, 0.2)");
          gradient.addColorStop(0.2, "rgba(255, 0, 0, 0.0)");
          gradient.addColorStop(0, "rgba(255, 0, 0, 0)");
          return gradient;
        },
        borderWidth: 3,
        fill: false,
        maxBarThickness: 6,
        // yAxisID: "y1",
      },
    ],
  };

  useEffect(() => {
    if (dataChart) {
      const getLabelDates = dataChart?.costRevenueCharts?.map((date) => {
        const day1 = dayjs(fromDate).format("DD/MM/YYYY");
        const day2 = dayjs(toDate).format("DD/MM/YYYY");
        if (day1 === day2) {
          return dayjs(date.id).format("HH:mm");
        }
        return dayjs(date.id).format("DD/MM");
      });
      setLabels(getLabelDates);

      const getDataRevenue = dataChart?.costRevenueCharts?.map(
        (value) => value.revenueAmount
      );
      setDataRevenue(getDataRevenue);

      const getDataOrder = dataChart?.costRevenueCharts?.map(
        (value) => value.costAmount
      );
      setDataOrder(getDataOrder);
    }
  }, [dataChart]);

  const formatter = (value) => (
    <CountUp end={value} duration={1} separator="," />
  );

  const columns = [
    {
      key: "crType",
      title: "Loại phiếu",
      dataIndex: "crType",
      render: (text) => {
        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <img
              src={text === "COST" ? icons.cost : icons.revenue}
              alt="image"
              className="h-8 w-8"
            />
            <p>{text === "COST" ? "Phiếu chi" : "Phiếu thu"}</p>
          </div>
        );
      },
      width: 150,
    },
    {
      key: "crCode",
      title: "Mã phiếu",
      dataIndex: "crCode",
    },
    {
      key: "createdForUser",
      title: "Người tạo phiếu",
      dataIndex: "createdForUser",
      render: (text) => `${text?.fullName || ""}`,
    },
    {
      key: "userPaid",
      title: "Người chi tiền",
      dataIndex: "userPaid",
      render: (text) => `${text?.fullName || ""}`,
    },
    {
      key: "costRevenueCategory",
      title: "Khoản mục",
      dataIndex: "costRevenueCategory",
      render: (text) => `${text?.content || ""}`,
    },
    {
      key: "dateTime",
      title: "Ngày tạo",
      dataIndex: "dateTime",
      render: (text) => dayjs(text).format("HH:mm DD/MM/YYYY"),
      width: 200,
    },
    {
      key: "content",
      title: "Nội dung",
      dataIndex: "content",
    },
    {
      key: "amount",
      title: "Số tiền",
      dataIndex: "amount",
      render: (text, record) => (
        <p
          className={
            record?.crType === "COST" ? "text-red-500" : "text-primary"
          }
        >
          <span>{record?.crType === "COST" ? "-" : "+"}</span>
          {formatMoney(text)}đ
        </p>
      ),
    },
    {
      key: "action",
      render: (record) => (
        <div className="flex items-center justify-center gap-2">
          <AddCostRevenue isEdit item={record} />
          <DeleteCostRevenue crId={record.id} />
        </div>
      ),
    },
  ];

  const onChangePage = (page, pageSize) => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  const onChangeDate = (date) => {
    setFromDate(date[0]);
    setToDate(date[1]);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Quản lý thu chi</h1>
        <div
          className={`rounded-lg border ${
            dataChart?.differenceAmount < 0
              ? "border-red-500"
              : "border-primary"
          } px-3 py-1`}
        >
          Chênh lệch thu chi:{" "}
          <span
            className={`text-lg font-bold ${
              dataChart?.differenceAmount < 0 ? "text-red-500" : "text-primary"
            }`}
          >
            {dataChart?.differenceAmount
              ? formatMoney(dataChart?.differenceAmount)
              : 0}
            đ
          </span>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Thu chi",
            children: (
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Select
                      style={{
                        width: 250,
                      }}
                      allowClear
                      value={crType}
                      onChange={(value) => setCrType(value)}
                      placeholder="Chọn loại phiếu"
                      options={[
                        { label: "Phiếu chi", value: "COST" },
                        { label: "Phiếu thu", value: "REVENUE" },
                      ]}
                    />
                    <Select
                      style={{
                        width: 250,
                      }}
                      allowClear
                      value={createdForUser}
                      mode="multiple"
                      onChange={(value) => setCreatedForUser(value)}
                      placeholder="Chọn người tạo phiếu"
                      options={dataStaffs?.content?.map((staff) => ({
                        label: staff.fullName,
                        value: staff.id,
                      }))}
                    />
                    <Select
                      style={{
                        width: 250,
                      }}
                      allowClear
                      value={userPaid}
                      mode="multiple"
                      onChange={(value) => setUserPaid(value)}
                      placeholder="Chọn người thu/chi"
                      options={dataStaffs?.content?.map((staff) => ({
                        label: staff.fullName,
                        value: staff.id,
                      }))}
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
                        Khoản thu
                      </h3>
                      <Statistic
                        value={dataChart?.revenueAmount}
                        formatter={formatter}
                        valueStyle={{
                          fontSize: 30,
                          fontWeight: "700",
                          whiteSpace: "no-wrap",
                        }}
                      />
                    </div>
                    <div className="flex h-12 min-w-[48px] items-center justify-center rounded-full">
                      <img
                        src={icons.revenue}
                        alt="icon"
                        className="h-12 w-12"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div>
                      <h3 className="whitespace-nowrap text-lg text-black1">
                        Khoản chi
                      </h3>
                      <Statistic
                        value={dataChart?.costAmount}
                        formatter={formatter}
                        valueStyle={{
                          fontSize: 30,
                          fontWeight: "700",
                          whiteSpace: "no-wrap",
                        }}
                      />
                    </div>
                    <div className="flex h-12 min-w-[48px] items-center justify-center rounded-full">
                      <img src={icons.cost} alt="icon" className="h-12 w-12" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-[400px] w-full rounded-lg border border-gray-200 p-4 shadow-sm">
                  <h4 className="mb-2 text-base font-semibold text-gray-500">
                    Thống kê theo khoản Thu/ Chi
                  </h4>
                  <Line options={options1} data={data1} />
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="w-full overflow-hidden rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-base font-semibold text-gray-500">
                        Sổ thu chi
                      </h4>

                      <AddCostRevenue />
                    </div>
                    <Table
                      rowKey={(record) => `${record.id}`}
                      dataSource={dataCostRevenue?.content || []}
                      columns={columns}
                      scroll={{ x: "max-content" }}
                      bordered
                      loading={isLoadingCostRevenue}
                      pagination={{
                        simple: window.innerWidth > 640 ? false : true,
                        current: page + 1,
                        pageSize,
                        pageSizeOptions: [20, 50, 100],
                        total: dataCostRevenue?.totalElements,
                        onChange: onChangePage,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} của ${total} bản ghi`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ),
          },
          { key: "2", label: "Khoản mục", children: <CategoryCostRevenue /> },
        ]}
      />
    </div>
  );
};

export default Report;
