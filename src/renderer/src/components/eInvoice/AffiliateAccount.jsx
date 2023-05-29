import { Button, Input, List } from "antd";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { icons, images } from "../../constants";
import { useNavigate } from "react-router-dom";

const data1 = [
  {
    title: "Lotus Cyber",
    icon: icons.iconLotus,
    bgIcon: "bg-orange-50",
  },
  {
    title: "Mobifone",
    icon: icons.iconMobifone,
    bgIcon: "bg-[#CBE5F5]",
  },
];

const AffiliateAccount = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row">
      <div className="h-[500px] flex-1 pr-10">
        <div className="mt-8 flex items-center justify-between">
          <div>
            <p className="text-sm">Tài khoản liên kết</p>
            <p className="text-xs text-gray-400">Đã kết nối 2 tài khoản</p>
          </div>

          <div className="flex items-center gap-2">
            <Input placeholder="Tìm đơn vị tham gia..." />
            <Button
              type="primary"
              className="flex items-center gap-1"
              icon={<AiOutlineSearch size={14} />}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <List
            itemLayout="horizontal"
            dataSource={data1}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <div className="rounded-md bg-primary/10 px-3 py-1 text-xs text-primary">
                    Đã kết nối
                  </div>,
                  <Button onClick={() => navigate("/e-invoice/list")}>
                    Chi tiết
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      className={`${item.bgIcon} flex h-12 w-[48px] items-center justify-center rounded-md p-2`}
                    >
                      <img
                        src={item.icon}
                        alt="icon"
                        className="object-cover"
                      />
                    </div>
                  }
                  title={<p>{item.title}</p>}
                  description={
                    <p className="text-xs text-gray-400">ID: 1851061111</p>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
      <div className="h-[500px] flex-1">
        <p className="text-sm mt-8">Dịch vụ hàng tuần</p>
        <p className="text-xs text-gray-400">04/21/2023</p>
        <div className="grid h-[420px] grid-cols-2 bg-[#DAE1F3]/20 mt-4 rounded-lg">
          <div className="flex items-center justify-center">
            <img src={images.eInvoice} alt="invoice" className="mx-auto object-cover w-[70%]" />
          </div>
          <div className="flex items-center justify-center">
            <div>
              <h4 className="font-semibold mb-2 text-lg">Dịch vụ Lotus</h4>
              <p className="text-gray-500">
                Nội dung quảng cáo sản phẩm sắp ra mắt cho khách hàng tham khảo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateAccount;
