import { Button, Input, InputNumber, Modal, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ButtonChangeQuantityWithNote from '../ButtonChangeQuantityWithNote'
import { motion } from 'framer-motion'
import { classNames, formatMoney } from '../../utils/common'
import FoodGroup from './FoodGroup'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../features/cart/cartSlice'
import { Scrollbars } from 'react-custom-scrollbars-2'
import FoodGroupCheckbox from './FoodGroupCheckbox'

const FoodDetail = ({ selectedFood, setSelectedFood }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [note, setNote] = useState('')
  const [orderFoods, setOrderFoods] = useState({})
  const [toggleChangePrice, setToggleChangePrice] = useState(false)
  const [price, setPrice] = useState(0)
  const foods = useSelector((state) => state.foods.foods)

  const getOptionsFood = (foodId) => {
    return foods.find((food) => food.id === foodId)?.optionGroups || []
  }

  useEffect(() => {
    if (selectedFood) {
      setOrderFoods({})
      setIsOpen(true)
      setCount(selectedFood?.quantity)
      setNote(selectedFood?.note)
      setPrice(selectedFood?.price)
    }
  }, [selectedFood])

  const onCancel = () => {
    setSelectedFood(null)
    setCount(0)
    setNote('')
    setIsOpen(false)
  }

  const onAddFoodOption = () => {
    const dataFood = {
      ...selectedFood,
      newOptions: Object.values(orderFoods),
      newQuantity: count,
      note,
      newPrice: price
    }

    dispatch(addToCart(dataFood))
    onCancel()
  }

  return (
    <Modal
      open={isOpen}
      onOk={onAddFoodOption}
      onCancel={onCancel}
      centered
      okText="Xác nhận"
      destroyOnClose
    >
      <div className="flex w-full flex-col items-center justify-center">
        {selectedFood && (
          <>
            <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <div
                // layout
                // animate={{ opacity: 1 }}
                // initial={{ opacity: 0 }}
                // exit={{ opacity: 0 }}
                className={classNames(
                  selectedFood.soldOut ? 'pointer-events-none opacity-30' : '',
                  'flex items-center justify-between py-4 pr-4'
                )}
                key={selectedFood.id}
              >
                <div
                  className="flex flex-1 items-center gap-2"
                  // onClick={() => setSelectedFood(selectedFood)}
                >
                  <img
                    src={selectedFood.image}
                    alt="food"
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <p className='text-lg'>{selectedFood.name}</p>
                    {toggleChangePrice ? (
                      <div>
                        <InputNumber
                          value={price}
                          onChange={(value) => setPrice(value)}
                          controls={false}
                          className="mr-2 w-[120px]"
                          placeholder="Giá tiền"
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          min={0}
                          max={10000001}
                          size="small"
                        />
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => setToggleChangePrice(false)}
                        >
                          Lưu
                        </Button>
                      </div>
                    ) : (
                      <p>
                        {selectedFood.tbillingTime ? <div>{formatMoney(selectedFood.billingTime.pricePerTimeBlock)}đ/ {selectedFood.billingTime.timeBlock}p</div> : <p>{formatMoney(price)}đ</p>}
                        {selectedFood?.changePrice && (
                          <span
                            className="ml-2 cursor-pointer text-red-500 underline"
                            onClick={() => setToggleChangePrice(true)}
                          >
                            Thay đổi giá
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-[100px] self-end md:self-center">
                <ButtonChangeQuantityWithNote
                  food={selectedFood}
                  count={count}
                  setCount={setCount}
                />
              </div>
            </div>

            <div className="w-full py-2">
              <p>Ghi chú</p>
              <Input.TextArea
                placeholder="Nhập ghi chú"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {getOptionsFood(selectedFood.id)?.length > 0 && <Scrollbars style={{ height: '50vh' }}>
              <div className="w-full space-y-4">
                {/* Hiển thị các option chọn 1 */}
                {getOptionsFood(selectedFood.id)
                  ?.filter((x) => x.maxSelection === 1)
                  ?.map((groups) => {
                    return (
                      <FoodGroup
                        key={groups.id}
                        group={groups}
                        selectedFood={selectedFood}
                        orderFoods={orderFoods}
                        setOrderFoods={setOrderFoods}
                      />
                    )
                  })}

                {/* Hiển thị các option chọn nhiều */}
                {getOptionsFood(selectedFood.id)
                  ?.filter((x) => x.maxSelection > 1)
                  ?.map((groups) => {
                    return (
                      <FoodGroupCheckbox
                        key={groups.id}
                        group={groups}
                        selectedFood={selectedFood}
                        orderFoods={orderFoods}
                        setOrderFoods={setOrderFoods}
                      />
                    )
                  })}
              </div>
            </Scrollbars>}
          </>
        )}
      </div>
    </Modal>
  )
}

export default FoodDetail
