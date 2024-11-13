import React, { useState } from "react";
import "./ChangePassWord.scss";
import { otpInstance } from "../../api/instance";
import instance from "../../api/instance";
import OTPComponent from "../OTPComponent";
import { passwordSchema } from "../../utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassWord({ userData }) {
  const [isSendedOTP, setIsSendedOTP] = useState(false);
  const [otp, setOTP] = useState(0);

  // Hàm callback để reset isSendedOTP
  const resetIsSendedOTP = () => {
    setIsSendedOTP(false);
  };

  //handle send OTP through email
  const handleGetOTP = () => {
    (async () => {
      try {
        console.log(userData.email);
        const res = await otpInstance.post(
          "/verify/registration",
          userData.email
        );
        console.log(res);
        if (res.data.code === 200) setIsSendedOTP(true);
      } catch (error) {
        console.log(error);
      }
    })();
  };
  //react hook form with zod validationSchema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data) => {
    const RequestChangePW = {
      email: userData.email,
      ...data,
      otp,
    };
    console.log(RequestChangePW);
    ///
    (async () => {
      try {
        console.log(userData.email);
        const res = await instance.put(
          "/users/changePassword",
          RequestChangePW
        );
        if (res.data.code === 200) {
          toast.success("Bạn đã Đổi mật khẩu thành công!");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };

  return (
    <div className="info-section rounded">
      <ToastContainer />
      <h2 className="fw-bold ">Đổi mật khẩu</h2>
      <div className="">
        <div className="info-grid">
          <div className="get-otp">
            <div className="d-flex align-items-center">
              <button
                onClick={() => handleGetOTP()}
                className="btn btn-primary mr-2"
                disabled={isSendedOTP}
              >
                Get OTP
              </button>
              <input onChange={(e) => setOTP(e.target.value)} type="text" />

              {isSendedOTP ? (
                <OTPComponent onCountdownComplete={resetIsSendedOTP} />
              ) : (
                ""
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="info-item">
              <label>Mật khẩu mới</label>
              <input type="password" {...register("password")} />
              {errors.newPassword && <span>{errors.newPassword.message}</span>}
            </div>
            <div className="info-item">
              <label>Xác nhận lại mật khẩu mới</label>
              <input type="password" {...register("passwordConfirm")} />
              {errors.confirmPassword && (
                <span>{errors.confirmPassword.message}</span>
              )}
            </div>
            <button className="btn btn-success mt-4">Lưu thông tin</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassWord;
