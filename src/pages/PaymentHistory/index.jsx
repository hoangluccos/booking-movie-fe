import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import thư viện mã QR
import instance from "../../api/instance";

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await instance.get("/users/ticket");
        console.log(response.data.result);
        setTransactions(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="my-4 flex-grow">
      <div className="content mt-6 mb-5">
        <div className="payment-history">
          <h2 className="text-2xl font-bold mb-5">Lịch sử giao dịch</h2>
          <p className="text-red-500 mb-3 underline">
            Hãy đưa mã QR phía dưới cho nhân viên
          </p>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-200 p-3 text-left">STT</th>
                <th className="bg-gray-200 p-3 text-left">Mã QR</th>
                <th className="bg-gray-200 p-3 text-left">Phim - Thời gian</th>
                <th className="bg-gray-200 p-3 text-left">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-3">
                    Không có giao dịch nào
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => {
                  // Ghép thông tin vào mã QR
                  const qrData = {
                    ticketId: transaction.id,
                    seats: transaction.seats.map(
                      (seat) => `${seat.locateRow}${seat.locateColumn}`
                    ),
                    movieName: transaction.movieName,
                    startTime: transaction.startTime,
                    endTime: transaction.endTime,
                    totalPrice: transaction.totalPrice,
                  };

                  return (
                    <tr key={transaction.id}>
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">
                        <QRCodeCanvas
                          value={JSON.stringify(qrData)}
                          size={84}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      </td>
                      <td className="p-3 border">
                        {transaction.movieName} - {transaction.startTime} -{" "}
                        {transaction.endTime}
                      </td>
                      <td className="p-3 border">
                        {transaction.totalPrice} VND
                      </td>
                    </tr>
                  );
                })
              )}
              <tr>
                <td
                  colSpan="3"
                  className="font-bold text-right p-3 border border-gray-300"
                >
                  Tổng cộng
                </td>
                <td className="font-bold p-3 border border-gray-300">
                  {transactions.reduce(
                    (total, transaction) => total + transaction.totalPrice,
                    0
                  )}{" "}
                  VND
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
