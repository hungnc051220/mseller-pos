import { useCreateTableMutation } from "@/api/tableApiSlice";
import { classNames, formatMoney } from "@/utils/common";
import { Form } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import EditTable from "./EditTable";

dayjs.extend(duration);

const TableCard = ({ floors, floorId, table, floorName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createTable, { isLoading }] = useCreateTableMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = (e) => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const [clock, setClock] = useState(dayjs());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setClock(dayjs());
    }, [1000]);

    return () => clearInterval(intervalId);
  }, []);

  const getTime = (time) => {
    const dateNow = dayjs(clock);
    const dateOrder = dayjs(time);
    const subtractTime = dateNow.diff(dateOrder);

    return dayjs.duration(subtractTime).format("HH:mm:ss");
  };

  const handleSubmit = async (values) => {
    try {
      await createTable({
        floorId,
        name: values.name,
      }).unwrap();
      notification.success({
        message: "Tạo bàn",
        description: <p>Tạo bàn mới thành công!</p>,
        placement: "bottomRight",
      });
    } catch (error) {
      console.log(error);
    }
    handleCancel();
  };

  return (
    // if status order equal false => create order
    // else navigate to order detail
    <motion.div
      layout
      className={classNames(
        !table?.status ? "bg-[#D7FFDB]" : "bg-[#FFF1D8]",
        "h-24 cursor-pointer overflow-hidden rounded-[10px] shadow hover:shadow-md"
      )}
    >
      <div className="relative flex h-full flex-1 items-start justify-between p-4">
        <div
          className="flex h-full flex-1 flex-col items-start justify-center"
          onClick={() =>
            !table.status
              ? navigate("/order/create", {
                  state: {
                    tableId: table?.id,
                    tableName: table?.name,
                    floorId,
                    floorName,
                  },
                })
              : navigate(`/order/edit`, {
                  state: {
                    //background: location,
                    orderId: table?.orderId,
                    tableName: table?.name,
                    floorName,
                  },
                })
          }
        >
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl overflow-hidden truncate w-24 text-black1">{table?.name}</h3>
            {table?.orderCreatedAt ? (
              <div className="flex items-center gap-1 text-orange-500">
                <BsClockHistory size={14} color="#f97316" />
                <p className="text-sm font-normal">
                  {getTime(table.orderCreatedAt)}
                </p>
              </div>
            ) : null}
          </div>

          {/* Table status */}
          <p
            className={classNames(
              !table.status ? "text-primary" : "text-[#FBA351]",
              "text-normal font-normal"
            )}
          >
            {!table.status ? "Sẵn sàng" : "Đang sử dụng"}
          </p>

          {/* Total cost */}
          {table?.totalNetCost && table?.totalNetCost !== 0 ? (
            <p className="text-normal font-normal">
              {formatMoney(table.totalNetCost)} đ
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          {/* Button edit table if status equal false */}
          {!table?.status && (
            <EditTable table={table} floors={floors} floorId={floorId} />
          )}

          {/* Button create order if status equal false */}
          {/* {!table?.status && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-md"
              onClick={() =>
                !table.status
                  ? navigate("/orders/create", {
                      state: {
                        background: location,
                        tableId: table?.id,
                        tableName: table?.name,
                        floorId,
                        floorName,
                      },
                    })
                  : navigate(`/orders/get-by-table`, {
                      state: {
                        background: location,
                        tableId: table?.id,
                        tableName: table?.name,
                        floorName,
                      },
                    })
              }
            >
              <AiOutlinePlus color="white" />
            </div>
          )} */}
          {/* {table?.status && (
            <ChangeTable table={table} floors={floors} floorId={floorId} />
          )} */}
        </div>

        {table.warnings && (
          <div className="absolute bottom-3 right-3">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inline-flex h-3/4 w-3/4 animate-ping rounded-full bg-orange-400 opacity-40"></span>
              <span className="relative inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-orange-500">
                <IoNotifications
                  size={20}
                  color="white"
                  className="animate-swing"
                />
              </span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TableCard;
