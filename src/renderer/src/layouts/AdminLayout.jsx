import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useGetFoodWaitingQuery } from '../api/foodApiSlice'
import { useUpdateDeviceMutation } from '../api/userApiSlice'
import { Sidebar, Topbar } from '../components'
import { onMessageListener, requestFirebaseNotificationPermission } from '../firebase'
import { classNames } from '../utils/common'
import { toast } from 'react-toastify'
import { apiSlice } from '../api/apiSlice'
import { store } from '../app/store'
import { setStatusPayment, setUpdate } from '../features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'

import {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED
} from 'electron-push-receiver/src/constants'
import { setMounted } from '../features/auth/authSlice'

const AdminLayout = () => {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(window.innerWidth < 640 ? false : true)
  const { data: dataWaiting } = useGetFoodWaitingQuery({})
  const [updateDevice] = useUpdateDeviceMutation()
  const user = useSelector((state) => state.auth.user)
  const isMounted = useSelector((state) => state.auth.isMounted)

  useEffect(() => {
    if (!isMounted) {
      const onUpdateDevice = async (deviceToken) => {
        try {
          await updateDevice({ deviceToken, deviceType: 'WEB' })
        } catch (error) {
          console.log(error)
        }
      }

      // Listen for service successfully started
      window.electron.ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
        console.log('service successfully started', token)
        onUpdateDevice(token)
      })

      // Handle notification errors
      window.electron.ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
        console.log('notification error', error)
      })

      // Send FCM token to backend
      window.electron.ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
        console.log('token updated', token)
      })

      // Start service
      const senderId = '380701649048' // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
      console.log('starting service and registering a client')
      window.electron.ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId)

      dispatch(setMounted())
    }
  }, [isMounted])

  useEffect(() => {
    // Display notification
    window.electron.ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
      // check to see if payload contains a body string, if it doesn't consider it a silent push
      if (serverNotificationPayload.notification.body) {
        // payload has a body, so show it to the user
        console.log('display notification', serverNotificationPayload)
        // let myNotification = new Notification(serverNotificationPayload.notification.title, {
        //   body: serverNotificationPayload.notification.body
        // })
        const message = JSON.parse(serverNotificationPayload.data.content1)
        if (message.type === 'order_updated') {
          dispatch(setUpdate(true))
          setTimeout(() => dispatch(setUpdate(false)), 300)
        }
        if (message.type === 'order_paid') {
          dispatch(setStatusPayment(true))
          setTimeout(() => dispatch(setStatusPayment(false)), 300)
        }
        if (message.type === 'payment_qr_static') {
          dispatch(setStatusPayment(true))
          setTimeout(() => dispatch(setStatusPayment(false)), 300)
        }
        toast.success(serverNotificationPayload?.notification?.body)
        const result = store.dispatch(apiSlice.endpoints.getFloors.initiate({}))
        const result1 = store.dispatch(
          apiSlice.endpoints.getOrders.initiate({
            pageSize: 10000,
            orderStatuses: ['WAITING'],
            web: true
          })
        )
        const result3 = store.dispatch(
          apiSlice.endpoints.getOrders.initiate({
            pageSize: 10000,
            takeAway: true,
            onTable: false,
            orderStatuses: ['CREATED']
          })
        )
        const result2 = store.dispatch(
          apiSlice.endpoints.getNotifications.initiate({
            pageSize: 20,
            pageNumber: 0
          })
        )
        result.refetch()
        result1.refetch()
        result2.refetch()
        result3.refetch()
      } else {
        // payload has no body, so consider it silent (and just consider the data portion)
        console.log(
          'do something with the key/value pairs in the data',
          serverNotificationPayload.data
        )
      }
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners(NOTIFICATION_RECEIVED);
    };
  }, [])

  return (
    <>
      <div className="flex overflow-x-hidden bg-white">
        <Sidebar total={dataWaiting?.totalElements} toggle={toggle} setToggle={setToggle} />
        <main
          className={classNames(
            !toggle ? 'ml-0 w-full' : 'ml-0 w-full sm:ml-[260px] sm:w-[calc(100%_-_260px)]',
            'relative flex min-h-screen flex-col pt-16 transition-all duration-500 ease-in-out'
          )}
        >
          <Topbar toggle={toggle} setToggle={setToggle} />
          <div className="h-[calc(100vh_-_104px)] overflow-y-auto p-6 pb-0">
            <Outlet />
          </div>
        </main>
      </div>
      <footer className="fixed bottom-0 z-50 w-full bg-[#239073] px-4 py-2 text-white">
        {user?.roleResponse?.name} - {user?.fullName}
      </footer>
    </>
  )
}

export default AdminLayout
