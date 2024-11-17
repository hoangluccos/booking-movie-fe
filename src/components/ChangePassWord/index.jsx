import React, { useState } from "react";
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

  const resetIsSendedOTP = () => {
    setIsSendedOTP(false);
  };

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
    (async () => {
      try {
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
    <div className="bg-white border rounded p-5">
      <ToastContainer />
      <h2 className="font-bold text-xl mb-5">Đổi mật khẩu</h2>
      <div className="info-grid">
        {/* OTP Section */}
        <div className="get-otp flex items-center space-x-4">
          <button
            onClick={handleGetOTP}
            className="bg-blue-300 py-2 px-4 rounded-full"
            disabled={isSendedOTP}
          >
            Get OTP
          </button>
          <input
            onChange={(e) => setOTP(e.target.value)}
            type="text"
            className="py-2 px-4 border rounded-lg border-gray-300"
          />
          {isSendedOTP && (
            <OTPComponent onCountdownComplete={resetIsSendedOTP} />
          )}
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="info-item mb-4">
            <label className="block mb-2">Mật khẩu mới</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.newPassword && (
              <span className="text-red-500">{errors.newPassword.message}</span>
            )}
          </div>
          <div className="info-item mb-4">
            <label className="block mb-2">Xác nhận lại mật khẩu mới</label>
            <input
              type="password"
              {...register("passwordConfirm")}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.confirmPassword && (
              <span className="text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-full mt-4"
          >
            Lưu thông tin
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassWord;
