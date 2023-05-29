import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmPhoneNumber, RegisterForm, VerifyNumber } from '../components'
import { images } from '../constants'

const Register = () => {
  const navigate = useNavigate()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [token, setToken] = useState('')
  const [step, setStep] = useState(1)

  const content = () => {
    switch (step) {
      case 1:
        return (
          <ConfirmPhoneNumber
            setToken={setToken}
            setStep={setStep}
            setPhoneNumber={setPhoneNumber}
          />
        )

      case 2:
        return <VerifyNumber token={token} setStep={setStep} phoneNumber={phoneNumber} />
      case 3:
        return <RegisterForm phoneNumber={phoneNumber} />

      default:
        break
    }
  }

  return (
    <>
      <div className="flex items-center justify-start gap-3">
        <img className="h-10 w-10" src={images.logo} alt="logo" />
        <h2 className="text-2xl font-bold text-black1">Đăng ký</h2>
      </div>
      <div className="mt-8">{content()}</div>
      <div className="flex items-center justify-center">
        <p className="text-sm">
          Đã có tài khoản?{" "}
          <a
            className="cursor-pointer text-blue-500 hover:text-blue-500/80"
            onClick={() => navigate('/auth/login')}
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </>
  )
}

export default Register
