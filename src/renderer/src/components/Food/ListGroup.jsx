import { Button, List, Modal, notification, Tag } from "antd";
import React, { useState } from "react";
import { AiOutlineLink, AiOutlineEdit } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDeleteFoodOptionMutation } from "../../api/foodOptionApiSlice";
import { useDeleteGroupFoodMutation } from "../../api/groupFoodApiSlice";
import { CreateAndUpdateGroupSelect, CreateAndUpdateFoodGroup } from "../../components";

const DeleteGroup = ({ item, isOption }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [deleteFoodOption, { isLoading: isLoadingDeleteFoodOption }] =
    useDeleteFoodOptionMutation();

  const [deleteGroupFood, { isLoading: isLoadingDeleteGroupFood }] =
    useDeleteGroupFoodMutation();

  const onDeleteFoodOption = async () => {
    try {
      if (isOption) {
        await deleteFoodOption(item.id).unwrap();
      } else {
        await deleteGroupFood(item.id).unwrap();
      }

      notification.success({
        message: `Xóa nhóm ${isOption ? "Lựa chọn" : "Thực đơn"}`,
        description: `Xóa nhóm ${isOption ? "Lựa chọn" : "Thực đơn"} ${
          item.name
        } thành công!`,
        placement: "bottomRight",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        type="link"
        danger
        onClick={showModal}
        icon={<FaRegTrashAlt size={23} />}
      />

      <Modal
        title={`Xóa nhóm ${isOption ? " Lựa chọn" : " thực đơn"}`}
        open={isModalOpen}
        onOk={onDeleteFoodOption}
        onCancel={handleCancel}
        confirmLoading={isLoadingDeleteFoodOption || isLoadingDeleteGroupFood}
      >
        <p>Bạn có chắc chắn muốn xóa nhóm lựa chọn {item.name} ?</p>
      </Modal>
    </>
  );
};

const ListGroup = ({ data, isOption }) => {
  const [isEditGroup, setIsEditGroup] = useState(true);
  return (
    <div>
      <div className="mb-2 flex justify-end">
        {isOption ? <CreateAndUpdateGroupSelect /> : <CreateAndUpdateFoodGroup />}
      </div>
      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={
              isOption
                ? [
                    <CreateAndUpdateGroupSelect isEdit={true} foodOption={item}/>,
                    <DeleteGroup item={item} isOption={isOption} />,
                  ]
                : [
                    <CreateAndUpdateFoodGroup
                      isEditGroup={isEditGroup}
                      item={item}
                    />,
                    <DeleteGroup item={item} isOption={isOption} />,
                  ]
            }
          >
            <List.Item.Meta
              title={item.name}
              description={item?.options?.map((item) => `${item.name}  `)}
            />
            {isOption &&
              (item.foodIds.length > 0 ? (
                <Tag color="#87d068">
                  Đã liên kết với {item.foodIds.length} món
                </Tag>
              ) : (
                <Tag color="#108ee9">Chưa có liên kết món</Tag>
              ))}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListGroup;
