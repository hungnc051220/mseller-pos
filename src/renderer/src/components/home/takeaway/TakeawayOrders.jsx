import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { formatMoney } from '@/utils/common'
import { Button, Spin } from 'antd'
import { AiOutlinePlus } from 'react-icons/ai'

const TakeawayOrders = ({ orders, isLoading }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="primary"
          className="flex items-center justify-center gap-1"
          icon={<AiOutlinePlus color="white" />}
          onClick={() => navigate('/order/create')}
        >
          Tạo đơn
        </Button>
      </div>
      <Spin spinning={isLoading}>
        <div
          className="mt-4 grid gap-6"
          style={{
            gridTemplateColumns:
              window.innerWidth > 640
                ? 'repeat(auto-fill, minmax(350px, 1fr))'
                : 'repeat(auto-fill, minmax(200px, 1fr))'
          }}
        >
          {orders?.content?.map((order) => (
            <div
              key={order.id}
              className="cursor-pointer space-y-2 rounded-lg border border-gray-200 p-4 text-sm hover:shadow-md"
              onClick={() =>
                navigate(`/order/edit`, {
                  state: {
                    orderId: order.id
                  }
                })
              }
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center ">
                  {order.codeTakeAway && (
                    <div className="mr-1 rounded-md bg-green-500 px-2 py-1 text-white">
                      {`#${order.codeTakeAway || '-'}`}
                    </div>
                  )}
                  {order?.customerName && (
                    <div className="rounded-md bg-orange-500 px-2 py-1 text-white">
                      {order?.customerName}
                    </div>
                  )}
                </div>
                <p className="text-orange-500">{t(order.status)}</p>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div>Tên nhân viên:</div>
                <p>{order.logs[0].user.fullName}</p>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div>Tên khách hàng:</div>
                <p>{order?.customerName}</p>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div>Thời gian tạo:</div>
                <p>{dayjs(order.logs[0].actionDatetime).format('HH:mm DD/MM/YYYY')}</p>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div>{t('totalPrice')}:</div>
                <p>{formatMoney(order.totalNetPrice)}đ</p>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div>{t('orderCode')}:</div>
                <p>{order.code}</p>
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  )
}

export default TakeawayOrders
