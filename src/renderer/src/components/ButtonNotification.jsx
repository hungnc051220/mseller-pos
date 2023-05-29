import {
  BellOutlined,
  CheckOutlined,
  CloseSquareOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  List,
  notification,
  Popconfirm,
  Popover,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import VirtualList from "rc-virtual-list";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneSharp, IoNotificationsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useReadNotificationMutation,
} from "../api/notificationApiSlice";

dayjs.extend(relativeTime);

const ActionNotification = ({ notificationId }) => {
  const [deleteNotification] = useDeleteNotificationMutation();
  const [readNotification] = useReadNotificationMutation();

  const onDelete = async () => {
    try {
      await deleteNotification(notificationId).unwrap();
      notification.success({
        message: "Đã gỡ thông báo",
        placement: "bottomLeft",
        className: "w-60 h-16 ",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onRead = async () => {
    try {
      await readNotification(notificationId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        type="link"
        className="flex items-center text-black"
        icon={<CheckOutlined />}
        onClick={onRead}
      >
        {" "}
        Đánh dấu đã đọc
      </Button>
      <Button
        type="link"
        className="flex items-center text-black"
        icon={<CloseSquareOutlined />}
        onClick={onDelete}
      >
        Gỡ Thông báo này
      </Button>
    </div>
  );
};

const ContainerHeight = 400;
const ButtonNotification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNotification, setTotalNotification] = useState(0);
  const [readAllNotification] = useReadAllNotificationMutation();
  const [readNotification] = useReadNotificationMutation();
  const { data, isLoading } = useGetNotificationsQuery({
    pageSize: 20,
    pageNumber,
  });

  useEffect(() => {
    if (!open) {
      setPageNumber(0);
    }
  }, [open]);

  useEffect(() => {
    if (data) {
      // setTotalNotification(
      //   data?.content.filter((item) => item.status === "NEW")
      // );
      setTotalPages(data?.data?.totalPages);
    }
  }, [data]);

  const onReadAll = async () => {
    try {
      await readAllNotification().unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const redirectLink = async ({ id, orderId }) => {
    try {
      await readNotification(id).unwrap();
      navigate(`/orders/${orderId}`, {
        state: { background: location },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenChange = () => {
    setOpen((prev) => !prev);
  };

  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      if (pageNumber + 1 < totalPages) {
        setPageNumber((prev) => prev + 1);
      }
    }
  };

  const content = (
    <List bordered={false} split={false}>
      <VirtualList
        data={data?.data?.content || []}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="id"
        onScroll={onScroll}
      >
        {(item) => (
          <List.Item
            key={item.id}
            className={`group cursor-pointer py-2 pl-4 pr-1 hover:bg-slate-100 ${
              item.status === "READ" ? "opacity-70" : ""
            }`}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  className="flex h-11 w-11 items-center justify-center bg-white"
                  style={{ borderColor: "#2db894" }}
                  icon={<BellOutlined style={{ color: "#2db894" }} />}
                />
              }
              title={
                <p
                  className="text-sm font-medium"
                  onClick={() => {
                    setOpen(false);
                    redirectLink(item);
                  }}
                >
                  {item.content}
                </p>
              }
              description={
                <p
                  className={`text-sm ${
                    item.status === "NEW" ? "font-medium text-primary" : ""
                  }`}
                >
                  {dayjs(item.createdAt).fromNow()}
                </p>
              }
            />
            <div className="invisible group-hover:visible">
              <Popover
                placement="bottomRight"
                content={<ActionNotification notificationId={item.id} />}
                trigger="click"
                overlayInnerStyle={{
                  padding: "10px",
                }}
              >
                <Button type="link" icon={<MoreOutlined />} />
              </Popover>
            </div>
          </List.Item>
        )}
      </VirtualList>
    </List>
  );

  return (
    <Popover
      title={
        <div className="flex w-full items-center justify-between pt-3 pl-4">
          <span className="text-lg">Thông báo</span>
          {data?.totalUnread > 0 ? (
            <div>
              <Popconfirm
                title="Bạn có chắc chắn muốn đọc tất cả thông báo ?"
                placement="bottom"
                okText="Xác Nhận"
                cancelText="Hủy"
                onConfirm={onReadAll}
              >
                <Button type="link">
                  Đọc tất cả
                  <span className="ml-1">
                    <IoCheckmarkDoneSharp size="13" />
                  </span>
                </Button>
              </Popconfirm>
            </div>
          ) : null}
        </div>
      }
      content={content}
      trigger="click"
      overlayStyle={{
        width: window.innerWidth < 640 ? "98vw" : "400px",
        padding: 4,
      }}
      overlayInnerStyle={{ padding: 0 }}
      getPopupContainer={(trigger) => trigger.parentElement}
      placement="bottomRight"
      showArrow={false}
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
    >
      <Tooltip placement="bottom" title="Thông báo" className="group">
        <div
          className="relative mr-2 cursor-pointer"
          onClick={handleOpenChange}
        >
          <IoNotificationsOutline
            size={24}
            color="white"
            className="group-hover:animate-swing"
          />
          {data?.totalUnread > 0 && (
            <>
              <div className="absolute -top-2 -right-2.5 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {data?.totalUnread > 9 ? "9+" : data?.totalUnread}
              </div>
              <div className="absolute -top-2 -right-2.5 flex h-5 min-w-[20px] animate-ping rounded-full bg-red-200 delay-[5000]"></div>
            </>
          )}
        </div>
      </Tooltip>
    </Popover>
  );
};

export default ButtonNotification;
