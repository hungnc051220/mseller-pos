import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import { store } from "./app/store";
import dayjs from "dayjs";
import App from "./App";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "react-perfect-scrollbar/dist/css/styles.css";

dayjs.locale("vi");

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={"Loading..."}>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2DB894",
            fontFamily: "Product Sans, sans-serif",
          },
        }}
        locale={viVN}
      >
        <StyleProvider hashPriority="high">
          <HashRouter>
              <App />
            <ToastContainer
              position="bottom-right"
              hideProgressBar={true}
              closeOnClick
              theme="light"
              autoClose={3000}
            />
          </HashRouter>
        </StyleProvider>
      </ConfigProvider>
    </Provider>
  </Suspense>
);
