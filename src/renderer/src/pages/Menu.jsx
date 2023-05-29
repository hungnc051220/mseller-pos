import { Tabs } from 'antd'
import React, { useState } from 'react'
import { useGetFoodOptionsQuery } from '../api/foodOptionApiSlice';
import { useGetGroupFoodsQuery } from '../api/groupFoodApiSlice';
import { ListGroup } from '../components';
import ListMenu from './ListMenu';


const Menu = () => {
  const { data: FoodOptions } = useGetFoodOptionsQuery();
  const { data: GroupFoods } = useGetGroupFoodsQuery({})

    const onChange = () => {
      };
      const items = [
        {
          key: '1',
          label: `Thực đơn`,
          children: <ListMenu/>,
        },
        {
          key: '2',
          label: `Nhóm lựa chọn`,
          children: <ListGroup isOption={true} data={FoodOptions}/>,
        },
        {
          key: '3',
          label: `Nhóm thực đơn`,
          children: <ListGroup data={GroupFoods}/>,
        },
      ];
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  )
}

export default Menu
