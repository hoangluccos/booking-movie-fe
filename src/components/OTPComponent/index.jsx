import React, { useState, useEffect } from "react";
function OTPComponent({ onCountdownComplete }) {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      onCountdownComplete();
    }
  }, [countdown, onCountdownComplete]);

  return (
    <div>
      <p className="text-red-600 mb-[0px] ml-[4px]">
        Đã gửi OTP. Thời gian còn lại: {countdown} giây
      </p>
    </div>
  );
}

export default OTPComponent;
