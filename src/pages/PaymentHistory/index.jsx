import React from "react";

const PaymentHistory = () => {
  return (
    <div className="my-4">
      <div className="content mt-6 mb-5">
        <div className="payment-history">
          <h2 className="text-2xl font-bold">Lịch sử giao dịch</h2>
          <div className="filters flex justify-end items-center mb-5">
            <select className="mr-2 p-2 text-sm border border-gray-300 rounded">
              <option>Đặt vé</option>
              <option>Mua hàng</option>
            </select>
            <input
              type="month"
              className="mr-2 p-2 text-sm border border-gray-300 rounded"
            />
            <button className="mr-2 p-2 text-sm bg-red-500 text-white rounded">
              X
            </button>
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
                <th className="bg-gray-200 p-3 text-left">Điểm RP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan="5"
                  className="font-bold text-right p-3 border border-gray-300"
                >
                  Tổng cộng
                </td>
                <td className="font-bold p-3 border border-gray-300">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
