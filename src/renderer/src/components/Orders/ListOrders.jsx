import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { classNames, formatMoney } from '../../utils/common'
import { Table } from 'antd'

const ListOrders = ({ orders = [], isLoading }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const getTotal = (list) => {
    return list.reduce((total, item) => (total += item.quantity), 0)
  }

  const listStatus = {
    WAITING: { color: 'text-[#54007B]', bgColor: 'bg-[#ECDEF2]', text: 'Chờ xác nhận' },
    CREATED: { color: 'text-[#E58C05]', bgColor: 'bg-[#FFE9C9]', text: 'Đang xử lý' },
    COMPLETED: { color: 'text-[#02C081]', bgColor: 'bg-[#E1FFF7]', text: 'Hoàn thành' },
    CANCELLED: { color: 'text-[#E13641]', bgColor: 'bg-[#FFE2E2]', text: 'Huỷ bỏ' }
  }

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, data) => {
        return <p>{data.logs[0].user?.fullName}</p>
      },
      width: '200px'
    },
    {
      title: 'Tổng số món',
      dataIndex: 'totalFoods',
      key: 'totalFoods',
      render: (_, data) => {
        return <p>{getTotal(data.foods)}</p>
      },
      width: '100px'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalNetPrice',
      key: 'totalNetPrice',
      render: (text) => formatMoney(text),
      align: 'right',
      width: '150px'
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
      render: (_, data) => {
        return (
          <p>
            {data.floor?.name} - {data.table?.name}
          </p>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <div
          className={classNames(
            listStatus[text]?.color,
            listStatus[text]?.bgColor,
            'inline-flex w-28 items-center justify-center rounded-xl px-2 py-1 text-sm'
          )}
        >
          {listStatus[text]?.text}
        </div>
      ),
      align: 'center',
      width: 120
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentType',
      key: 'paymentType',
      render: (text) => (text === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'),
      width: '200px'
    }
  ]

  return (
    <Table
      dataSource={orders}
      columns={columns}
      scroll={{ x: 'max-content' }}
      rowClassName={(record, index) => {
        return classNames(index % 2 === 0 ? 'table-row-light' : 'table-row-dark', 'cursor-pointer')
      }}
      rowKey={(record) => `${record.id}`}
      loading={isLoading}
      onRow={(record) => ({
        onClick: () =>
          navigate(`/order/edit`, {
            state: {
              orderId: record.id
            }
          })
      })}
      pagination={{
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn bàn`,
        hideOnSinglePage: true,
      }}
    />
  )
}

export default ListOrders
