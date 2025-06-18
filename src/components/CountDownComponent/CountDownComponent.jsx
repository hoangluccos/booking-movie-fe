import React, { useEffect, useState } from "react";

function CountDownComponent({ setIsTimeout }) {
  const [countDown, setCountdown] = useState(30);

  useEffect(() => {
    if (countDown <= 0) {
      setIsTimeout(true);
    }
    const timer = setTimeout(() => setCountdown(countDown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countDown]);

  const minutes = Math.floor(countDown / 60);
  const seconds = countDown % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return (
    <div className="bg-[#f3ea28] rounded-xl text-black flex w-[100px] h-[60px] flex-col justify-center items-center border border-black">
      <p className="text-black font-bold my-0">Thời gian</p>
      <p className="text-black font-bold my-0">{formattedTime}</p>
    </div>
  );
}

export default CountDownComponent;
