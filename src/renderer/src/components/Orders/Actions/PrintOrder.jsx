import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Input, Table } from 'antd'
import { toast } from 'react-toastify'
import { useCancelOrderMutation } from '../../../api/orderApiSlice'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { formatMoney } from '../../../utils/common'
import { createQrCode, createQrCodeStatic } from '../../../api'
import { useState } from 'react'
import { useEffect } from 'react'
const { TextArea } = Input
import QRCode from 'react-qr-code'

export const ContentPrint = ({ componentRef, order, qrCode }) => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div style={{ display: 'none' }}>
      <div
        ref={componentRef}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingBottom: '40px',
          fontWeight: '500',
          fontFamily: "'Product Sans', sans-serif"
        }}
      >
        <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          {user?.company?.companyName}
        </h3>
        <p style={{ textAlign: 'center', fontSize: '12px', marginBottom: '4px' }}>Địa chỉ:</p>
        <p style={{ textAlign: 'center', fontSize: '12px', marginBottom: '4px' }}>
          Hotline: {user?.phoneNumber}
        </p>

        <h4
          style={{
            marginTop: '8px',
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          HOÁ ĐƠN BÁN HÀNG
        </h4>

        <div className="space-y-[2px] pb-2" style={{ paddingBottom: '8px' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <p style={{ fontSize: '0.75rem', lineHeight: '1rem', width: '60%', margin: 0 }}>
              Số HĐ: {order?.code.substring(7)}
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                whiteSpace: 'nowrap',
                flex: '1 1 0%',
                width: '40%',
                marginBottom: '4px'
              }}
            >
              Ngày: {dayjs().format('DD/MM/YYYY')}
            </p>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                whiteSpace: 'nowrap',
                flex: '1 1 0%',
                width: '60%',
                marginBottom: '4px'
              }}
            >
              {order?.floor
                ? `Vị trí: ${order?.floor?.name} - ${order?.table?.name}`
                : `KH: ${order?.customerName || ''}`}
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                whiteSpace: 'nowrap',
                width: '40%',
                marginBottom: '4px'
              }}
            >
              Giờ: {dayjs().format('HH:mm')}
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', lineHeight: '1rem', marginBottom: '4px' }}>
            {' '}
            Nhân viên: {order?.logs[0]?.user?.fullName}
          </p>
        </div>

        <table style={{ marginTop: '0.25rem', width: '100%' }}>
          <thead style={{ borderBottom: '4px solid #111827' }}>
            <tr>
              <th style={{ fontSize: '0.75rem', lineHeight: '1rem', fontWeight: '700' }}>
                Tên món
              </th>
              <th style={{ fontSize: '0.75rem', lineHeight: '1rem', fontWeight: '700' }}>SL</th>
              <th style={{ fontSize: '0.75rem', lineHeight: '1rem', fontWeight: '700' }}>
                Đơn giá
              </th>
              <th style={{ fontSize: '0.75rem', lineHeight: '1rem', fontWeight: '700' }}>
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody style={{ borderTopWidth: '1px', borderColor: '#111827' }}>
            {order?.foods?.map((food) => (
              <tr key={food.index}>
                <td
                  style={{
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem',
                    paddingRight: '0.75rem',
                    fontSize: '0.75rem',
                    lineHeight: '1rem'
                  }}
                >
                  {food.name}
                </td>
                <td
                  style={{
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                    fontSize: '0.75rem',
                    lineHeight: '1rem'
                  }}
                >
                  {food.quantity}
                </td>
                <td
                  style={{
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                    fontSize: '0.75rem',
                    lineHeight: '1rem',
                    textAlign: 'right'
                  }}
                >
                  {formatMoney(food.price)}
                </td>
                <td
                  style={{
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem',
                    paddingLeft: '0.75rem',
                    fontSize: '0.75rem',
                    lineHeight: '1rem',
                    textAlign: 'right'
                  }}
                >
                  {formatMoney(food.price * food.quantity)}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '500',
                marginBottom: '4px'
              }}
            >
              Tổng cộng
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '700',
                marginBottom: '4px'
              }}
            >
              {formatMoney(order?.totalPrice)}đ
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '500',
                marginBottom: '4px'
              }}
            >
              Chiết khấu
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '700',
                marginBottom: '4px'
              }}
            >
              {formatMoney(
                order?.discountType === 'PERCENT'
                  ? (order?.totalPrice * order?.discount || 0) / 100
                  : order?.discount || 0
              )}
              đ
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '500',
                marginBottom: '4px'
              }}
            >
              Phụ thu
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '700',
                marginBottom: '4px'
              }}
            >
              {formatMoney(
                order?.surchargeType === 'PERCENT'
                  ? (order?.totalPrice * order?.surcharge || 0) / 100
                  : order?.surcharge || 0
              )}
              đ
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '500',
                marginBottom: '4px'
              }}
            >
              Thành tiền
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: '700',
                marginBottom: '4px'
              }}
            >
              {formatMoney(order?.totalNetPrice)}đ
            </p>
          </div>
        </div>

        {qrCode && <QRCode value={qrCode} size={120} style={{ margin: 'auto', marginTop: 16 }} />}

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.75rem',
              lineHeight: '1rem',
              fontWeight: '500',
              textAlign: 'center',
              marginBottom: '4px'
            }}
          >
            {user?.company?.companyName} xin chân thành cảm ơn!
          </p>
          <p style={{ fontSize: '0.75rem', lineHeight: '1rem', margin: 0 }}>
            mSeller - Powered by MB
          </p>
        </div>
      </div>
    </div>
  )
}

const PrintOrder = ({ order, componentRef, handlePrint }) => {
  const [qrCode, setQrCode] = useState('null')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!order?.code) return
    const createQr = async () => {
      try {
        const response = await createQrCodeStatic()
        //   {
        //   orderCode: order.code,
        //   notice: `thanh toan`,
        // }
        var reader = new window.FileReader()
        reader.readAsText(response.data)
        reader.onload = function () {
          var imageDataUrl = reader.result
          setQrCode(imageDataUrl)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    createQr()
  }, [order?.code])

  return (
    <>
      <Button
        size="large"
        className="max-w-[250px] flex-1"
        loading={loading}
        onClick={() => {
          handlePrint()
        }}
      >
        In tạm tính (F9)
      </Button>
      {order && qrCode && !loading && (
        <ContentPrint componentRef={componentRef} order={order} qrCode={qrCode} />
      )}
    </>
  )
}

export default PrintOrder
