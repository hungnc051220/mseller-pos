import React, { useEffect, useState } from "react";
import { useGetReportChangedOrdersQuery } from "../../api/reportApiSlice";
import { DatePicker, Table, Tag, Select, Button } from "antd";
import { classNames, formatMoney, getTotal } from "../../utils/common";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { listStatus, listStatusAction } from "../../constants";
import { uniq } from "lodash";
import { useGetOrderDetailChangeQuery } from "../../api/orderApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import HistoryOrder from "../Orders/Actions/HistoryOrder";
import { CiLocationOn, CiMoneyBill, CiSearch } from "react-icons/ci";
import { BsPerson, BsQrCode } from "react-icons/bs";
import { useGetFloorsQuery } from "../../api/floorApiSlice";
import { useGetStaffsQuery } from "../../api/staffApiSlice";
import { RiToolsLine } from "react-icons/ri";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineClose, AiOutlineCloseCircle, AiOutlineMinus, AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { IoMdAdd } from 'react-icons/io';
const { RangePicker } = DatePicker;

const ChangedOrder = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [floorIds, setFloorIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [actions, setActions] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [sortBy, setSortBy] = useState(undefined);
  const [direction, setDirection] = useState(undefined);
  const { data, isLoading, isFetching } = useGetReportChangedOrdersQuery({
    pageNumber: page,
    pageSize,
    floorIds,
    employeeIds,
    actions,
    fromDate: fromDate ? dayjs(fromDate).format() : "",
    toDate: toDate ? dayjs(toDate).format() : "",
    sortBy,
    direction,
  });
  const { data: dataStaffs } = useGetStaffsQuery({});
  const { data: dataFloors } = useGetFloorsQuery({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: dataOrder, isLoading: isLoadingOrder } =
    useGetOrderDetailChangeQuery(selectedOrder ? selectedOrder : skipToken, {
      refetchOnMountOrArgChange: true,
    });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedOrder && !isLoadingOrder) {
      setOpen(true);
    }
  }, [selectedOrder, isLoadingOrder]);

  useEffect(() => {
    if (!open) {
      setSelectedOrder(null);
    }
  }, [open]);

  const onChangeDate = (date, dateString) => {
    setPage(0);
    if (!date) {
      setFromDate(null);
      setToDate(null);
    }
    setFromDate(date[0]);
    setToDate(date[1]);
  };

  const onDeleteFilter = () => {
    setActions([]);
    setEmployeeIds([]);
    setFloorIds([]);
    setFromDate(null);
    setToDate(null);
    setSortBy(undefined);
    setDirection(undefined);
    setOrderBy(null);
  };

  const columns = [
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
      width: 200
    },
    {
      title: "Thời gian tạo đơn",
      key: "createdAt",
      render: (_, data) => {
        return (
          <p>{dayjs(data.logs[0].actionDatetime).format("HH:mm DD/MM/YYYY")}</p>
        );
      },
    },
    {
      title: "Số lần thay đổi",
      dataIndex: "changeTimes",
      key: "changeTimes",
      width: 120,
      align: "center",
    },
    {
      title: "Thay đổi lần cuối",
      dataIndex: "changeTimes",
      key: "changeTimes",
      width: 200,
      render: (_, data) => {
        const getLastChangeObject = data.logs
          .filter((x) => x.actions)
          .filter(
            (log) =>
              log.action === "CHANGE_FOOD" ||
              log.action === "CHANGE_DISCOUNT" ||
              log.action === "CHANGE_FOOD_DISCOUNT"
          )
          .pop();
        return (
          <>
            <p>{getLastChangeObject?.user?.fullName}</p>
            <span className="text-sm text-black1">
              {getLastChangeObject?.actionDatetime
                ? dayjs(getLastChangeObject?.actionDatetime).format(
                    "HH:mm DD/MM/YYYY"
                  )
                : "-"}
            </span>
          </>
        );
      },
    },
    {
      title: "Người tạo",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, data) => {
        return (
          <p>{data.logs.find((x) => x.action === "CREATED")?.user?.fullName}</p>
        );
      },
    },
    {
      title: "Các thao tác thay đổi",
      key: "actions",
      render: (_, data) => {
        const mappedData = data.logs
          ?.filter((x) => x.actions)
          .map((log) => log.actions)
          .flat(1);
        return (
          <div className="space-y-2">
            {uniq(mappedData).map((item) => {
              return (
                <Tag color={listStatusAction[item]?.color} key={item}>
                  {listStatusAction[item]?.text}
                </Tag>
              );
            })}
          </div>
        );
      },
      width: 300,
    },

    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => formatMoney(text),
      align: "right",
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
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (text) => (text === "CASH" ? "Tiền mặt" : "Chuyển khoản"),
    },
  ];

  const onChangePage = (page, pageSize) => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  return (
    <div className="">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select
          style={{
            width: 250,
          }}
          allowClear
          showSearch
          mode="multiple"
          maxTagCount="responsive"
          value={actions}
          onChange={(value) => {
            setPage(0);
            setActions(value);
          }}
          placeholder={
            <div className="flex items-center">
              <RiToolsLine size={16} />
              &nbsp;Chọn thao tác
            </div>
          }
          options={[
            {label: "ADD_FOOD", icon: AiOutlinePlusCircle, color: "green"},
            {label: "DEL_FOOD", icon: AiOutlineCloseCircle, color: "red"},
            {label: "SUB_FOOD", icon: AiOutlineMinusCircle, color: "orange"},
            {label: "UPD_DISCOUNT", icon: RiToolsLine, color: "purple"},
            {label: "UPD_SURCHARGE", icon: RiToolsLine, color: "purple"},
          ].map((item) => ({
            value: item.label,
            label: (
              <div className="flex items-center">
                <item.icon size={16} color={item.color}/>
                &nbsp;{t(item.label)}
              </div>
            ),
          }))}
        />
        <Select
          style={{
            width: 250,
          }}
          allowClear
          showSearch
          mode="multiple"
          maxTagCount="responsive"
          value={floorIds}
          onChange={(value) => {setPage(0); setFloorIds(value)}}
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
          showSearch
          mode="multiple"
          maxTagCount="responsive"
          value={employeeIds}
          onChange={(value) => {setPage(0); setEmployeeIds(value)}}
          placeholder={
            <div className="flex items-center">
              <BsPerson size={16} />
              &nbsp;Chọn nhân viên
            </div>
          }
          options={dataStaffs?.content?.map((staff) => ({
            value: staff.id,
            label: (
              <div className="flex items-center">
                <BsPerson size={16} />
                &nbsp;{staff.fullName}
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
          value={orderBy}
          onChange={(value) => {
            setPage(0);
            if (value) {
              setSortBy("totalPrice");
            } else {
              setSortBy(undefined);
            }
            setDirection(value);
            setOrderBy(value);
          }}
          placeholder={
            <div className="flex items-center">
              <BiSortAlt2 size={16} />
              &nbsp;Sắp xếp theo đơn giá
            </div>
          }
          options={[
            {
              value: "DESC",
              label: (
                <div className="flex items-center">
                  <AiOutlineArrowDown size={16} color="red"/>
                  &nbsp;Đơn giá từ cao tới thấp
                </div>
              ),
            },
            {
              value: "ASC",
              label: (
                <div className="flex items-center">
                  <AiOutlineArrowUp size={16} color="green"/>
                  &nbsp;Đơn giá từ thấp tới cao
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
        />
        <Button type="primary" onClick={onDeleteFilter}>
          Xoá bộ lọc
        </Button>
      </div>
      <Table
        dataSource={data?.content}
        columns={columns}
        scroll={{ x: "max-content", y: "calc(100vh - 410px)" }}
        rowClassName={(record, index) => {
          return classNames(
            index % 2 === 0 ? "table-row-light" : "table-row-dark",
            "cursor-pointer"
          );
        }}
        rowKey={(record) => `${record.id}`}
        loading={isLoading || isFetching}
        onRow={(record) => ({
          onClick: () => setSelectedOrder(record.id),
        })}
        pagination={{
          simple: window.innerWidth > 640 ? false : true,
          current: page + 1,
          pageSize,
          pageSizeOptions: [20, 50, 100],
          total: data?.totalElements,
          onChange: onChangePage,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} đơn bàn`,
        }}
      />

      <HistoryOrder open={open} setOpen={setOpen} order={dataOrder} />
    </div>
  );
};

export default ChangedOrder;
