import { useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { Avatar, Form, notification, Spin, Tabs } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCloseShiftMutation, useGetShiftQuery, useGetShiftsQuery } from '../api/shiftApiSlice'
import {
  CloseShift,
  CostRevenue,
  ListOrders,
  ListShifts,
  ShiftDetail,
  StartShift
} from '../components'
import { formatMoney } from '../utils/common'

const Shifts = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [employeeId, setEmployeeId] = useState(null)

  const { data, isLoading } = useGetShiftsQuery({
    pageNumber: page,
    pageSize,
    employeeId,
    fromDate: fromDate ? dayjs(fromDate).format() : '',
    toDate: toDate ? dayjs(toDate).format() : ''
  })

  const {
    data: dataShift,
    isLoading: isLoadingShift,
    refetch
  } = useGetShiftQuery(data?.content[0]?.status ? data?.content[0]?.id : skipToken)

  const [closeShift, { isLoading: isLoadingCloseShift }] = useCloseShiftMutation()
  const [selectedShift, setSelectedShift] = useState(null)

  const [form] = Form.useForm()

  const handleCancel = () => {
    form.resetFields()
    setIsOpen(false)
  }

  const onChangePage = (page, pageSize) => {
    setPage(page - 1)
    setPageSize(pageSize)
  }

  return (
    <Spin spinning={isLoading}>
      <div className="pb-6">
        <h1 className="text-3xl font-semibold">Quản lý ca</h1>
        <div className="mt-2">
          {/* Kiểm tra trạng thái ca gần nhất
          - Nếu status là false => Ca đã kết thúc => Được phép tạo ca mới
          - Nếu status là true => Ca đang diễn ra => Hiển thị chi tiết ca hiện ca */}
          {data && !isLoading && (
            <div className="flex justify-center">
              {!data?.content?.[0]?.status ? (
                <StartShift />
              ) : dataShift && !isLoadingShift ? (
                <div className="w-[400px] rounded-lg border border-gray-200 p-4 text-sm hover:shadow-md">
                  <div className="-mx-4 flex items-center justify-between gap-1 border-b border-gray-200 px-4 pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar src={dataShift?.employee?.avatar} />
                      <div>
                        <p>{dataShift?.employee?.fullName}</p>
                        <div className="flex items-center gap-1">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              !dataShift?.status ? 'bg-red-500' : 'bg-primary'
                            }`}
                          ></div>
                          <p className={!dataShift?.status ? 'text-red-500' : 'text-primary'}>
                            {!dataShift?.status ? 'Đã kết thúc' : 'Đang diễn ra'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="rounded-md bg-gray-300 px-2 py-1">{dataShift?.code}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <div>Giờ mở ca:</div>
                    <p>{dayjs(dataShift?.timeStartShifts).format('HH:mm DD/MM/YYYY')}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <div>Số dư đầu ca:</div>
                    <p>{formatMoney(dataShift?.openingBalance)}đ</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-1">
                    <CloseShift shift={dataShift} setSelectedShift={setSelectedShift} />
                    <a
                      className="text-primary underline"
                      onClick={() => setSelectedShift(dataShift?.id)}
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              ) : undefined}
            </div>
          )}

          {/* Danh sách đơn, Quản lý thu chi, danh sách ca */}
          <Tabs
            type="card"
            className="mt-4"
            defaultActiveKey="1"
            items={[
              {
                label: 'Danh sách đơn',
                key: '1',
                children: <ListOrders orders={dataShift?.orders} />
              },
              {
                label: 'Danh sách thu chi',
                key: '2',
                children: <CostRevenue shift={dataShift} isLoading={isLoading} />
              },
              {
                label: 'Danh sách ca',
                key: '3',
                children: (
                  <ListShifts
                    shifts={data?.content}
                    setSelectedShift={setSelectedShift}
                    setPage={setPage}
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                    employeeId={employeeId}
                    setEmployeeId={setEmployeeId}
                  />
                )
              }
            ]}
          />

          {/* Chi tiết ca */}
          {selectedShift && (
            <ShiftDetail selectedShift={selectedShift} setSelectedShift={setSelectedShift} />
          )}
        </div>
      </div>
    </Spin>
  )
}

export default Shifts
