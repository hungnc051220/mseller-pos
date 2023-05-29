import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmPhoneNumber, VerifyNumber } from "../components";
import { images } from "../constants";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);

  const content = () => {
    switch (step) {
      case 1:
        return (
          <ConfirmPhoneNumber
            setToken={setToken}
            setStep={setStep}
            setPhoneNumber={setPhoneNumber}
            isForgotPassword={true}
          />
        );

      case 2:
        return (
          <VerifyNumber
            token={token}
            setStep={setStep}
            phoneNumber={phoneNumber}
            isForgotPassword={true}
          />
        );

      default:
        break;
    }
  };

  return (
    <>
      <div className="flex items-center justify-start gap-3">
        <img className="h-10 w-10" src={images.logo} alt="logo" />
        <h2 className="text-2xl font-bold text-black1">
          Quên mật khẩu
        </h2>
      </div>
      <div className="mt-8">{content()}</div>
      <div className="flex items-center justify-center">
        <a className="cursor-pointer text-sm hover:text-black1" onClick={() => navigate(-1)}>Quay lại</a>
      </div>
    </>
  );
};

export default ForgotPassword;
