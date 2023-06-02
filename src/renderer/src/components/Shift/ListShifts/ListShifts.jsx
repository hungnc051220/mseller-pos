import { DatePicker, Select } from 'antd'
import ShiftCard from '../ShiftCard'
import { useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import { useGetStaffsQuery } from '@/api/staffApiSlice'
import removeAccents from 'vn-remove-accents'

const { RangePicker } = DatePicker

const ListShifts = ({
  shifts,
  setSelectedShift,
  setPage,
  setFromDate,
  setToDate,
  fromDate,
  toDate,
  employeeId,
  setEmployeeId
}) => {
  const { data: dataStaffs } = useGetStaffsQuery({})

  const onChangeDate = (date) => {
    setPage(0)
    if (!date) {
      setFromDate(null)
      setToDate(null)
    }
    setFromDate(date[0])
    setToDate(date[1])
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4 justify-end">
        <Select
          style={{
            width: 250
          }}
          allowClear
          showSearch
          value={employeeId}
          onChange={(value) => {
            setPage(0)
            setEmployeeId(value)
          }}
          placeholder={
            <div className="flex items-center">
              <BsPerson size={16} />
              &nbsp;Chọn nhân viên
            </div>
          }
          options={dataStaffs?.content?.map((staff) => ({
            value: staff.id,
            label: (
              <div className="flex items-center">
                <BsPerson size={16} />
                &nbsp;{staff.fullName}
              </div>
            )
          }))}
          optionFilterProp="children"
          filterOption={(input, option) =>
            removeAccents(option?.label ?? '')
              .toLowerCase()
              .includes(removeAccents(input.toLowerCase()))
          }
        />

        <RangePicker
          className="w-[360px]"
          format={(value) => value.format('DD/MM/YYYY')}
          defaultValue={[null, null]}
          onChange={onChangeDate}
          value={[fromDate, toDate]}
          allowClear
        />
      </div>
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns:
            window.innerWidth > 640
              ? 'repeat(auto-fill, minmax(350px, 1fr))'
              : 'repeat(auto-fill, minmax(200px, 1fr))'
        }}
      >
        {shifts?.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} setSelectedShift={setSelectedShift} />
        ))}
      </div>
    </>
  )
}

export default ListShifts
