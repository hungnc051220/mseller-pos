import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { images } from '@/constants'
import { formatMoney } from '@/utils/common'
import { List, Table } from 'antd'
import { AddCostRevenue } from '@/components'
import DeleteCostRevenue from '../../cost-revenue/DeleteCostRevenue'
import { icons } from '@/constants'

const CostRevenueCard = ({ t, title, icon, value }) => {
  return (
    <div className="group flex w-[200px] items-center justify-start gap-3 rounded-lg border border-gray-200 py-2 pl-6">
      <img src={icon} alt="icon" className="h-12 w-12" />
      <div>
        <p>{t(title)}</p>
        <p className={title === 'Chi' ? 'text-red-500' : 'text-primary'}>
          {formatMoney(value || 0)}đ
        </p>
      </div>
    </div>
  )
}

const CostRevenue = ({ shift }) => {
  const { t } = useTranslation()

  const columns = [
    {
      key: 'crType',
      title: 'Loại phiếu',
      dataIndex: 'crType',
      render: (text) => {
        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <img
              src={text === 'COST' ? icons.cost : icons.revenue}
              alt="image"
              className="h-8 w-8"
            />
            <p>{text === 'COST' ? 'Phiếu chi' : 'Phiếu thu'}</p>
          </div>
        )
      },
      width: 150
    },
    {
      key: 'crCode',
      title: 'Mã phiếu',
      dataIndex: 'crCode'
    },
    {
      key: 'createdForUser',
      title: 'Người tạo phiếu',
      dataIndex: 'createdForUser',
      render: (text) => `${text?.fullName || ''}`
    },
    {
      key: 'userPaid',
      title: 'Người chi tiền',
      dataIndex: 'userPaid',
      render: (text) => `${text?.fullName || ''}`
    },
    {
      key: 'costRevenueCategory',
      title: 'Khoản mục',
      dataIndex: 'costRevenueCategory',
      render: (text) => `${text?.content || ''}`
    },
    {
      key: 'dateTime',
      title: 'Ngày tạo',
      dataIndex: 'dateTime',
      render: (text) => dayjs(text).format('HH:mm DD/MM/YYYY'),
      width: 200
    },
    {
      key: 'content',
      title: 'Nội dung',
      dataIndex: 'content'
    },
    {
      key: 'amount',
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (text, record) => (
        <p className={record?.crType === 'COST' ? 'text-red-500' : 'text-primary'}>
          <span>{record?.crType === 'COST' ? '-' : '+'}</span>
          {formatMoney(text)}đ
        </p>
      )
    },
    {
      key: 'action',
      render: (record) => (
        <div className="flex items-center justify-center gap-2">
          <AddCostRevenue isEdit item={record} />
          <DeleteCostRevenue crId={record.id} />
        </div>
      )
    }
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <CostRevenueCard t={t} icon={icons.revenue} title="Thu" value={shift?.totalRevenue} />
        <CostRevenueCard t={t} icon={icons.cost} title="Chi" value={shift?.totalCost} />
      </div>

      {/* Tạo thu chi */}
      {shift?.status && (
        <div className='flex justify-end mt-4'>
          <AddCostRevenue />
        </div>
      )}

      {/* Danh sách thu chi */}
      {/* <div className="mt-3 rounded-lg border border-gray-200">
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
      </div> */}

      <Table
      className='mt-4'
        rowKey={(record) => `${record.id}`}
        dataSource={shift?.costRevenues || []}
        columns={columns}
        scroll={{ x: 'max-content' }}
        bordered
        pagination={{
          hideOnSinglePage: true
        }}
      />
    </div>
  )
}

export default CostRevenue
