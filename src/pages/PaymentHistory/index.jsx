import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import instance from "../../api/instance";
import { Link } from "react-router-dom";
import { Select } from "antd";
import { toast, ToastContainer } from "react-toastify";

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");

  console.log("transaction", transactions);
  const sortTransactions = (data, order) => {
    return [...data].sort((a, b) => {
      if (order === "latest") {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await instance.get("/users/ticket");
        const transactions = response.data.result;

        const transactionsWithExtra = await Promise.all(
          transactions.map(async (t) => {
            try {
              const res = await instance.get(`/movies/${t.movieId}`);
              const image = res.data.result.image || "";
              const timestamp = new Date(
                t.date.split("-").reverse().join("-") + "T" + t.time
              ).getTime();
              return { ...t, image, timestamp };
            } catch (error) {
              const timestamp = new Date(
                t.date.split("-").reverse().join("-") + "T" + t.time
              ).getTime();
              return { ...t, image: "", timestamp };
            }
          })
        );

        const sorted = sortTransactions(transactionsWithExtra, sortOrder);
        setTransactions(sorted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTransactions();
  }, [sortOrder]);

  const onChangeFilter = (value) => {
    toast.success("Đã lọc thành công");
    setSortOrder(value);
    const sorted = sortTransactions(transactions, value);
    setTransactions(sorted);
  };

  return (
    <div className="my-4 flex-grow select-none">
      <ToastContainer />
      <div className="content mt-6 mb-5">
        <div className="payment-history">
          <h2 className="text-2xl font-bold mb-5">Lịch sử giao dịch</h2>
          <p className="text-red-500 mb-3 underline">
            Hãy đưa mã QR phía dưới cho nhân viên
          </p>

          <div className="flex justify-end gap-x-5 items-center p-2">
            <Select
              value={sortOrder}
              onChange={onChangeFilter}
              style={{ width: 180 }}
              options={[
                { value: "latest", label: "Ngày gần nhất" },
                { value: "oldest", label: "Ngày xa nhất" },
              ]}
            />
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-200 p-3 text-left">STT</th>
                <th className="bg-gray-200 p-3 text-left">Mã QR</th>
                <th className="bg-gray-200 p-3 text-left">Thông tin Phim</th>
                <th className="bg-gray-200 p-3 text-left">Thông tin Vé</th>
                <th className="bg-gray-200 p-3 text-left">
                  Thời gian giao dịch
                </th>
                <th className="bg-gray-200 p-3 text-left">Tổng tiền</th>
                <th className="bg-gray-200 p-3 text-left">Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-3">
                    Không có giao dịch nào
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => {
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
                      <td className="p-3 border text-center">{index + 1}</td>
                      <td className="p-3 border">
                        <QRCodeCanvas
                          value={JSON.stringify(qrData)}
                          size={84}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      </td>
                      <td className="p-3 border flex justify-center">
                        <div className="flex flex-col items-center">
                          <div className="w-[80px]">
                            <img
                              src={transaction.image}
                              style={{ objectFit: "contain" }}
                              alt=""
                            />
                          </div>
                          <p className="font-bold mt-1">
                            {transaction.movieName}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 border text-center">
                        <p>Ngày chiếu {transaction.dateScreenTime}</p>
                        <p>
                          Thời gian: {transaction.startTime} -{" "}
                          {transaction.endTime}
                        </p>
                        <div className="flex justify-center">
                          Ghế:&nbsp;
                          <p>
                            {transaction.seats
                              .map((s) => `${s.locateRow}${s.locateColumn}`)
                              .join(" - ")}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 border">
                        <p>Ngày: {transaction.date}</p>
                        <p>Giờ: {transaction.time}</p>
                      </td>
                      <td className="p-3 border">
                        {transaction.totalPrice.toLocaleString()} VND
                      </td>
                      <td className="p-3 border">
                        {transaction.canComment ? (
                          <Link
                            className="text-red-400 underline"
                            to={`/movies/${transaction.movieId}#comment`}
                          >
                            Đánh giá ngay
                          </Link>
                        ) : (
                          <p className="text-red-500">Bạn chưa thể đánh giá</p>
                        )}
                      </td>
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
                  {transactions
                    .reduce(
                      (total, transaction) => total + transaction.totalPrice,
                      0
                    )
                    .toLocaleString()}{" "}
                  VND
                </td>
                <td className="border" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
