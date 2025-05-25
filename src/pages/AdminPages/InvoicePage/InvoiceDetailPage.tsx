import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { ConfigProvider } from "antd";
import { InvoiceDetailType, InvoiceType } from "../Data/Data.tsx";
import { useEffect } from "react";
import { getAllInvoiceDetails } from "../../../redux/slices/InvoiceSlice.tsx";

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const invoiceInfo = location.state as InvoiceType;
  const { error, isLoading, listInvoiceDetails } = useAppSelector(
    (state) => state.invoice
  );

  useEffect(() => {
    console.log("Invoice Info: ", invoiceInfo);
  }, []);

  useEffect(() => {
    dispatch(getAllInvoiceDetails({ ticketId: invoiceInfo.id }));
  }, [invoiceInfo.id]);

  const totalSeatPrice = listInvoiceDetails.reduce((acc, item) => {
    if (invoiceInfo.coupon?.discountType === "Other") {
      return acc + invoiceInfo.coupon.discountValue;
    }
    return acc + item.seat.price;
  }, 0);

  const foodPrice = invoiceInfo.food
    ? invoiceInfo.food.price * invoiceInfo.food.quantity
    : 0;

  let discountAmount = 0;
  if (invoiceInfo.coupon?.discountType === "Fixed") {
    discountAmount = invoiceInfo.coupon.discountValue;
  } else if (invoiceInfo.coupon?.discountType === "Percentage") {
    discountAmount = (totalSeatPrice * invoiceInfo.coupon.discountValue) / 100;
  }

  const totalPrice = totalSeatPrice - discountAmount + foodPrice;

  const showInvoiceDetailCus = (item: InvoiceDetailType, index: number) => (
    <div
      className={
        "grid grid-cols-5 bg-[#273142] text-white border-gray-700 border-b py-4"
      }
    >
      <div className="flex justify-center items-center p-2 font-saira">
        {index + 1}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.seat.isCouple ? "Couple Seat" : "Normal Seat"}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.seat.locateRow}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.seat.locateColumn}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {invoiceInfo.coupon?.discountType === "Other"
          ? `${invoiceInfo.coupon?.discountValue.toLocaleString("vi-VN")}đ`
          : `${item.seat.price.toLocaleString("vi-VN")}đ`}
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Tooltip: {
            colorBgSpotlight: "#1F2937",
            colorTextLightSolid: "#FFFFFF",
            borderRadius: 6,
            fontSize: 13,
            paddingXS: 8,
          },
          DatePicker: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "#FFFFFF",
            colorTextPlaceholder: "#FFFFFF",
            colorTextDisabled: "#FFFFFF",
            colorBorder: "transparent",
            borderRadius: 8,
            colorBgElevated: "#323D4E",
            fontSize: 14,
            colorIcon: "#FFFFFF",
          },
          Popover: {
            colorBgElevated: "#323D4E",
            colorText: "#FFFFFF",
            borderRadius: 8,
          },
          Popconfirm: {
            colorBgElevated: "#ffffff",
            colorText: "#000000",
            colorPrimary: "#ff4d4f",
            borderRadius: 8,
          },
          Button: {
            colorText: "#FFFFFF",
            colorBgContainer: "#323D4E",
            colorBorder: "transparent",
            borderRadius: 8,
          },
        },
      }}
    >
      <div className="min-h-[750px]">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <span className="text-white text-3xl font-saira pb-4">
            Invoices Detail
          </span>
          <div className="flex flex-wrap gap-2 items-center"></div>
        </div>

        <div className="bg-[#273142] h-[680px] rounded-xl px-12">
          <div className="text-white font-saira flex flex-row justify-evenly items-center pt-8 pb-16 text-lg">
            <div className="flex flex-col">
              <span className="pb-2">Owner</span>
              <span>
                Name: {invoiceInfo.user.firstName} {invoiceInfo.user.lastName}
              </span>
              <span>Email: {invoiceInfo.user.email}</span>
            </div>

            <div className="flex flex-col">
              <span className="pb-2">Showtime</span>
              <span>Movie: {invoiceInfo.showtime.movie.name}</span>
              <span>Date: {invoiceInfo.showtime.date}</span>
              <span>
                Time:{" "}
                {invoiceInfo.showtime.startTime.slice(0, 5) +
                  " - " +
                  invoiceInfo.showtime.endTime.slice(0, 5)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="pb-2">Theater</span>
              <span>Name: {invoiceInfo.showtime.theater.name}</span>
              <span>Location: {invoiceInfo.showtime.theater.location}</span>
            </div>

            <div className="flex flex-col space-y-2 line-clamp-2">
              <span className="break-words max-w-[180px] inline-block">
                Food:{" "}
                {invoiceInfo.food
                  ? `${(
                      invoiceInfo.food.price * invoiceInfo.food.quantity
                    ).toLocaleString("vi-VN")}đ - (${invoiceInfo.food.name} x${
                      invoiceInfo.food.quantity
                    })`
                  : "No food ordered"}
              </span>

              <span>
                Voucher:{" "}
                {invoiceInfo.coupon?.discountType === "Fixed"
                  ? `-${invoiceInfo.coupon?.discountValue.toLocaleString(
                      "vi-VN"
                    )}đ`
                  : invoiceInfo.coupon?.discountType === "Percentage"
                  ? `-${invoiceInfo.coupon?.discountValue}%`
                  : invoiceInfo.coupon?.discountType === "Other"
                  ? "Other"
                  : "No voucher usage"}
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <span>Invoice Date: {invoiceInfo.date}</span>
              <span>Invoice Time: {invoiceInfo.time.slice(0, 5)}</span>
            </div>
          </div>

          <div className="grid grid-cols-5">
            {["Serial No.", "Description", "Row", "Column", "Price"].map(
              (title, idx) => (
                <div
                  key={idx}
                  className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                    idx === 0 ? "rounded-tl-xl rounded-bl-xl" : ""
                  } ${idx === 4 ? "rounded-tr-xl rounded-br-xl" : ""}`}
                >
                  {title}
                </div>
              )
            )}
          </div>

          <div className="min-h-[480px]">
            {listInvoiceDetails.length > 0 ? (
              <>
                {listInvoiceDetails.map((item, index) => (
                  <div key={item.id}>{showInvoiceDetailCus(item, index)}</div>
                ))}
                <div className="grid grid-cols-5 text-white py-4">
                  <div className="col-span-4"></div>
                  <div className="relative flex items-center font-saira">
                    <span className="absolute left-0 whitespace-nowrap">
                      Total:
                    </span>
                    <span className="w-full text-center">
                      {totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-white text-center py-4">
                No information found
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default InvoiceDetailPage;
