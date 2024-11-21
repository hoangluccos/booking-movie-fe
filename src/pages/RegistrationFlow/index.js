import React, { useState } from "react";
import EmailForm from "./EmailForm";
import OTPVerification from "./OTPVerification";
import PersonalInfoForm from "./PersonalInfoForm";
import ForgetPW from "./ForgetPW";
import cinemaImage from "../../assets/cinema.jpg";
import instance, { otpInstance } from "../../api/instance";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  console.log(location.pathname.split("/")[1]);
  const isForgetPW = location.pathname.split("/")[1];

  const handleEmailSubmit = async (submittedEmail) => {
    setEmail(submittedEmail);
    setIsLoading(true);
    const req = {
      email: submittedEmail,
    };
    try {
      const res = await otpInstance.post("/verify/registration", req);
      console.log(res.data);
      setStep(2);
    } catch (error) {
      console.log("Sending OTP error:", error);
      alert("Mail không tồn tại. Hãy thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (submittedOtp) => {
    setIsLoading(true);
    const req = {
      email,
      otp: submittedOtp,
    };
    try {
      const res = await otpInstance.post("/verify/verifyOtp", req);
      console.log(res.data);
      if (res.data.result) {
        setOtp(submittedOtp);
        setStep(3);
      } else {
        alert("Mã OTP không chính xác!");
      }
    } catch (error) {
      console.log("Verify OTP error:", error);
      alert("Mã OTP không chính xác!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoSubmit = (personalInfo) => {
    personalInfo = {
      ...personalInfo,
      email: email,
      otp: otp,
    };
    console.log("Personal Info Submitted:", personalInfo);
    const createUser = async () => {
      try {
        let res;
        isForgetPW === "forget-password"
          ? (res = await instance.put("/users/changePassword", personalInfo))
          : (res = await instance.post("/users/", personalInfo));
        console.log(res.data);
        toast.success(res.data?.message || "Thành công");
        nav("/login");
      } catch (error) {
        console.log(error);
      }
    };
    createUser();
  };

  return (
    <div className="relative w-full h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm z-[-1]"
        style={{ backgroundImage: `url(${cinemaImage})` }}
      ></div>
      <ToastContainer />
      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500"></div>
            </div>
          )}

          {step === 1 && <EmailForm onSubmit={handleEmailSubmit} />}
          {step === 2 && (
            <OTPVerification email={email} onSubmit={handleOtpSubmit} />
          )}
          {step === 3 &&
            (isForgetPW === "forget-password" ? (
              <ForgetPW onSubmit={handlePersonalInfoSubmit} />
            ) : (
              <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RegistrationFlow;
