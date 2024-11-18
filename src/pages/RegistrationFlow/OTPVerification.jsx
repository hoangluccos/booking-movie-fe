import React, { useState } from "react";

const OTPVerification = ({ email, onSubmit }) => {
  const [otp, setOtp] = useState("");
  const [err_value, setErr_value] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      setErr_value(!err_value);
      return;
    }
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Xác thực OTP</h2>
      <p className="mb-2">
        OTP đã được gửi đến email: <strong>{email}</strong>
      </p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Nhập mã OTP"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />
      {err_value ? <p className="text-red-500 mb-3">Vui lòng nhập OTP</p> : ""}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Xác thực
      </button>
    </form>
  );
};

export default OTPVerification;
