import { notification, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";

const UploadFile = ({ setImageFile, selectedFood }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (selectedFood) {
      setFileList([
        {
          uid: "-1",
          status: "done",
          url: selectedFood.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [selectedFood]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
    
  };

  const onRemove = (file) => {
   if(file && selectedFood){
    notification.warning({
      message: "Vui lòng tải ảnh mới",
      description: <p>Nếu không có hình ảnh thay thế thì ảnh món ăn trước sẽ là  ảnh mặc định</p>,
      placement: "bottomRight",
    });
   }
  }

  return (
    <ImgCrop rotate modalTitle="Chỉnh sửa ảnh" modalOk='Xác nhận' modalCancel="Hủy">
      <Upload
     
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        onRemove={onRemove}
        beforeUpload={(file) => {
          setFileList([...fileList, file]);
          setImageFile(file);
          return false;
        }}      
      >
        {fileList.length < 1 && "+Tải ảnh lên"}
      </Upload>
    </ImgCrop>
  );
};
export default UploadFile;
