import { Button, List } from 'antd'
import { useGetCategoryCostRevenueQuery } from '../../../api/categoryCostRevenue'
import { HiOutlineTrash } from 'react-icons/hi'
import { BsPencil } from 'react-icons/bs'
import { AddCategoryCostRevenue } from '../..'
import DeleteCategoryCostRevenue from './DeleteCategoryCostRevenue'

const CategoryCostRevenue = () => {
  const { data } = useGetCategoryCostRevenueQuery({ pageSize: 100000, pageNumber: 0 })

  return (
    <>
      <div className="mb-4 flex justify-end">
        <AddCategoryCostRevenue />
      </div>
      <List
        bordered
        dataSource={data?.content || []}
        renderItem={(item) => (
          <List.Item
            actions={[
              <div className="flex items-center gap-1">
                <AddCategoryCostRevenue isEdit item={item} />
                {/* <BsPencil
                  color="blue"
                  size={18}
                  className="cursor-pointer hover:opacity-70"
                /> */}
                ,
                <DeleteCategoryCostRevenue categoryId={item.id} />
              </div>
            ]}
          >
            <p>{item.content}</p>
          </List.Item>
        )}
      />
    </>
  )
}

export default CategoryCostRevenue
