import React, { useState, useEffect } from "react";
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
    <div className="my-4">
      <div className="content mt-6 mb-5">
        <div className="payment-history">
          <h2 className="text-2xl font-bold">Lịch sử giao dịch</h2>
          <div className="filters flex justify-end items-center mb-5">
            <select className="mr-2 p-2 text-sm border border-gray-300 rounded">
              <option>Đặt vé</option>
            </select>
            {/* <input
              type="month"
              className="mr-2 p-2 text-sm border border-gray-300 rounded"
            />
            <button className="mr-2 p-2 text-sm bg-red-500 text-white rounded">
              X
            </button> */}
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-200 p-3 text-left">STT</th>
                <th className="bg-gray-200 p-3 text-left">
                  Thời gian giao dịch
                </th>
                <th className="bg-gray-200 p-3 text-left">Mã lấy vé</th>
                <th className="bg-gray-200 p-3 text-left">Thông tin rạp</th>
                <th className="bg-gray-200 p-3 text-left">Tổng tiền</th>
                <th className="bg-gray-200 p-3 text-left">Vị trí</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-3">
                    Không có giao dịch nào
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => {
                  const seatLocations = transaction.seats
                    .map((seat) => `${seat.locateRow}${seat.locateColumn}`)
                    .join(", ");
                  return (
                    <tr key={transaction.id}>
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">
                        {transaction.date} {transaction.time}
                      </td>
                      <td className="p-3 border">{transaction.id}</td>
                      <td className="p-3 border">
                        {transaction.movieName} - {transaction.startTime} -{" "}
                        {transaction.endTime}
                      </td>
                      <td className="p-3 border">
                        {transaction.totalPrice} VND
                      </td>
                      <td className="p-3 border">{seatLocations}</td>
                    </tr>
                  );
                })
              )}
              <tr>
                <td
                  colSpan="5"
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
