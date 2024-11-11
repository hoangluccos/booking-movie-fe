import React from "react";
import "./PaymentHistory.scss";

const PaymentHistory = () => {
  return (
    <div className="content mt-3 mb-5">
      <div className="payment-history">
        <h2>Lịch sử giao dịch</h2>
        <div className="filters">
          <select>
            <option>Đặt vé</option>
            <option>Mua hàng</option>
          </select>
          <input type="month" />
          <button>X</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Thời gian giao dịch</th>
              <th>Mã lấy vé</th>
              <th>Thông tin rạp</th>
              <th>Tổng tiền</th>
              <th>Điểm RP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5">Tổng cộng</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
