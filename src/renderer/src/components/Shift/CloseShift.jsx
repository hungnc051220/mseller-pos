import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { formatMoney } from '../../utils/common'
import { useCloseShiftMutation } from '../../api/shiftApiSlice'
import { Button, Modal } from 'antd'

const CloseShift = ({ shift, setSelectedShift }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const [closeShift, { isLoading }] = useCloseShiftMutation()

  const handleCancel = () => {
    setIsOpen(false)
  }

  const onCloseShift = async () => {
    try {
      await closeShift({
        shiftId: shift.id,
        timeCloseShifts: dayjs().format()
      }).unwrap()

      notification.success({
        message: 'Đóng ca',
        description: <p>Đóng ca thành công!</p>,
        placement: 'bottomRight'
      })
    } catch (error) {
      console.log(error)
    } finally {
      handleCancel()
    }
  }

  return (
    <div>
      <Button danger type="primary" onClick={() => setIsOpen(true)}>
        Kết thúc ca
      </Button>
      <Modal open={isOpen} onCancel={() => setIsOpen(false)} footer={null}>
        <h2 className="mb-4 mt-8 text-center text-xl font-bold">Kết thúc ca</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Mã ca:</p>
            <p className="rounded-lg bg-black1 px-2 py-1 font-bold text-white">{shift.code}</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Tên nhân viên:</p>
            <p className="font-bold text-black1">{shift.employee.fullName}</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Giờ mở ca:</p>
            <p className="font-bold text-black1">
              {dayjs(shift.timeStartShifts).format('HH:mm DD/MM/YYYY')}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Giờ kết thúc ca:</p>
            <p className="font-bold text-black1">
              {shift.timeCloseShifts
                ? dayjs(shift.timeCloseShifts).format('HH:mm DD/MM/YYYY')
                : '-'}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Số dư đầu ca:</p>
            <p className="font-bold text-black1">{formatMoney(shift.openingBalance)}đ</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Số dư cuối ca:</p>
            <p className="font-bold text-black1">
              {shift.endingBalance ? `${formatMoney(shift.endingBalance)}đ` : '-'}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-3">
            <p className="text-base font-normal">Tổng số đơn:</p>
            <p className="font-bold text-black1">{shift.numberOfOrder}</p>
          </div>

          <div className="space-y-3 pt-4">
            <Button type="primary" block size="large" loading={isLoading} onClick={onCloseShift}>
              Xác nhận
            </Button>
            <Button block size="large" onClick={() => setSelectedShift(shift?.id)}>
              Xem chi tiết
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CloseShift
