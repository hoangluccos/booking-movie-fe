import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({
    amount: null,
    orderInfo: "",
    responseCode: "",
    transactionNo: "",
  });

  useEffect(() => {
    // Parse dữ liệu từ query parameters
    const amount = searchParams.get("vnp_Amount");
    const orderInfo = decodeURIComponent(
      searchParams.get("vnp_OrderInfo") || ""
    );
    const responseCode = searchParams.get("vnp_ResponseCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");

    setPaymentInfo({
      amount: amount ? Number(amount) / 100 : 0, // VNPay trả về đơn vị là VNĐ * 100
      orderInfo,
      responseCode,
      transactionNo,
    });
  }, [searchParams]);

  const isSuccess = paymentInfo.responseCode === "00";

  return (
    <div className="content p-4">
      <h1 className="text-xl font-bold text-center mb-4">
        {isSuccess ? (
          <div className="text-green-400">
            <div className="text-[40px]">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <p className="mt-5">"Thanh toán thành công!"</p>
          </div>
        ) : (
          <div className="">
            <div className="bg-red-500">
              <i class="fa-solid fa-circle-exclamation"></i>
            </div>

            <p className="bg-red-500">"Thanh toán thất bại"</p>
          </div>
        )}
      </h1>
      {isSuccess ? (
        <div className="text-center">
          <p className="mb-2 font-bold">
            Mã giao dịch: {paymentInfo.transactionNo}
          </p>
          <p className="mb-2 font-bold">
            Số tiền: {paymentInfo.amount.toLocaleString()} VNĐ
          </p>
          <p className="mb-2 font-bold">{paymentInfo.orderInfo}</p>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Quay về trang chủ
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-2">Có lỗi xảy ra trong quá trình thanh toán.</p>
          <button
            className="p-2 bg-red-500 text-white rounded"
            onClick={() => {
              // Điều hướng về trang đặt vé
              window.location.href = "/booking";
            }}
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentCallback;
