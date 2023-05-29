import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { images } from "../../../constants";
import { formatMoney } from "../../../utils/common";
import { List } from "antd";
import AddCostRevenue from "./AddCostRevenue";

const CostRevenueCard = ({ t, title, icon, value }) => {
  return (
    <div className="group flex w-[250px] cursor-pointer items-center justify-start gap-3 rounded-lg border border-gray-200 py-6 pl-6 shadow hover:shadow-md">
      <img
        src={icon}
        alt="icon"
        className="h-12 w-12 group-hover:animate-bounce"
      />
      <div>
        <p>{t(title)}</p>
        <p className={title === "cost" ? "text-red-500": "text-primary"}>{formatMoney(value || 0)}đ</p>
      </div>
    </div>
  );
};

const CostRevenue = ({ shift }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <CostRevenueCard t={t} icon={images.exportIcon} title="Thu" value={shift?.totalRevenue}/>
        <CostRevenueCard t={t} icon={images.importIcon} title="Chi" value={shift?.totalCost}/>
      </div>

      {/* Tạo thu chi */}
      {shift?.status && <AddCostRevenue />}

      {/* Danh sách thu chi */}
      <div className="mt-3 rounded-lg border border-gray-200">
        <List
          itemLayout="horizontal"
          dataSource={shift?.costRevenues || []}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                className="items-center"
                avatar={
                  <img
                    src={
                      item.transactionType === "revenue"
                        ? images.exportIcon
                        : images.importIcon
                    }
                    className="h-8 w-8"
                  />
                }
                title={<p>{item.content}</p>}
                description={
                  <p>{dayjs(item.dateTime).format("HH:mm DD/MM/YYYY")}</p>
                }
              />
              <p
                className={
                  item.transactionType === "revenue"
                    ? "text-primary"
                    : "text-red-500"
                }
              >
                {item.transactionType === "revenue" ? "+" : "-"}
                {formatMoney(item.amount)}đ
              </p>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default CostRevenue;
