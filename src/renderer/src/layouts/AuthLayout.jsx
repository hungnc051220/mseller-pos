import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { images } from '../constants'
import { selectCurrentToken } from '../features/auth/authSlice'
import { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { toast } from 'react-toastify'

const AuthLayout = () => {
  const token = useSelector(selectCurrentToken)
  const [messsageText, setMesssageText] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    window.electronAPI.downloadUpdate()
    setIsModalOpen(false)
  }
  
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    window.electronAPI.getMessage((event, message) => {
      setMesssageText(message)
    })
  }, [])

  useEffect(() => {
    switch (messsageText.type) {
      case 'update-available':
        showModal()
        break
      case 'update-downloaded':
        toast.success(
          'Phiên bản mới đã được tải xuống. Khởi động lại ứng dụng để áp dụng cập nhật.'
        )
        break
    }
  }, [messsageText])

  return !token ? (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center bg-white px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Outlet />

          <div className="absolute bottom-1 left-1">
            v{import.meta.env.RENDERER_VITE_APP_VERSION}
          </div>
          {/* {content()} */}
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="relative z-10 px-14 leading-[60px] text-white">
          <h1 className="mt-14 text-[50px] font-bold">Giải pháp Quản lý bán hàng tổng thể</h1>
          <p className="mt-3 text-lg">
            Không chỉ là Phần mềm quản lý bán hàng mà chúng tôi cung cấp cho bạn một giải pháp kinh
            doanh toàn diện
          </p>
        </div>
        <img className="absolute inset-0 h-full w-full object-cover" src={images.bg} alt="login" />
      </div>

      <Modal
        title="Cập nhật phiên bản"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Cập nhật ngay"
        cancelText="Nhắc tôi sau"
      >
        <p className="text-base">Phiên bản hiện tại: {import.meta.env.RENDERER_VITE_APP_VERSION}</p>
        <p className="text-base">Đã có phiên bản mới: {messsageText?.releaseName}</p>
      </Modal>
    </div>
  ) : (
    <Navigate to="/" replace />
  )
}

export default AuthLayout
