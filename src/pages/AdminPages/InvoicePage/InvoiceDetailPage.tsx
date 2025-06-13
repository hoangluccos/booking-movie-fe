import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { Button, ConfigProvider, Empty } from "antd"; // Thêm Empty
import { InvoiceDetailType, InvoiceType } from "../Data/Data.tsx";
import { useEffect } from "react";
import { getAllInvoiceDetails } from "../../../redux/slices/InvoiceSlice.tsx";
import { LeftOutlined } from "@ant-design/icons";

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const invoiceInfo = location.state as InvoiceType | undefined; // Cho phép undefined
  const { error, isLoading, listInvoiceDetails } = useAppSelector(
    (state) => state.invoice
  );

  useEffect(() => {
    console.log("Invoice Info: ", invoiceInfo);
  }, [invoiceInfo]);

  useEffect(() => {
    if (invoiceInfo?.id) {
      dispatch(getAllInvoiceDetails({ ticketId: invoiceInfo.id }));
    }
  }, [invoiceInfo?.id]);

  // Kiểm tra nếu invoiceInfo không tồn tại
  if (!invoiceInfo) {
    return (
      <div className="text-white font-saira">
        <Empty description="Không tìm thấy dữ liệu hóa đơn" />
      </div>
    );
  }

  const totalSeatPrice = listInvoiceDetails.reduce((acc, item) => {
    if (invoiceInfo.coupon?.discountType === "Other") {
      return acc + (invoiceInfo.coupon?.discountValue || 0);
    }

    return acc + (item.seat?.price || 0);
  }, 0);

  const foodPrice = invoiceInfo.foods
    ? invoiceInfo.foods.reduce(
        (total, food) => total + food.price * food.quantity,
        0
      )
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
      className="grid grid-cols-5 bg-[#273142] text-white border-gray-700 border-b py-4"
      key={item.id}
    >
      <div className="flex justify-center items-center p-2 font-saira">
        {index + 1}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.seat
          ? item.seat.isCouple
            ? "Couple Seat"
            : "Normal Seat"
          : "Không có thông tin"}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.seat ? item.seat.locateRow : "Không có thông tin"}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.seat ? item.seat.locateColumn : "Không có thông tin"}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.seat
          ? invoiceInfo.coupon?.discountType === "Other"
            ? `${(invoiceInfo.coupon?.discountValue || 0).toLocaleString(
                "vi-VN"
              )}đ`
            : `${item.seat.price.toLocaleString("vi-VN")}đ`
          : "Không có thông tin"}
      </div>
    </div>
  );

  const handleClickGoBack = () => {
    navigate(-1);
  };

  // Giả định hàm handleEdit nếu bạn đã thêm nút Edit
  const handleEdit = () => {
    if (invoiceInfo.showtime?.movie) {
      console.log("Chỉnh sửa hóa đơn:", invoiceInfo);
      navigate(`/invoices/edit/${invoiceInfo.id}`, { state: invoiceInfo });
    } else {
      console.warn("Không thể chỉnh sửa: Thiếu dữ liệu phim");
      // Có thể hiển thị thông báo cho người dùng, ví dụ: alert
    }
  };

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
          <div className="flex items-center mb-8 justify-center">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={handleClickGoBack}
              className="text-white mr-4 font-saira transition-all duration-300 ease-in-out hover:!text-blue-400 hover:scale-110"
            />
            <span className="text-white text-3xl font-saira">
              Chi tiết hóa đơn
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Thêm nút Edit nếu bạn đã thêm nó */}
            <Button
              onClick={handleEdit}
              disabled={!invoiceInfo.showtime?.movie} // Vô hiệu hóa nếu không có dữ liệu phim
              className="text-white font-saira"
            >
              Sửa
            </Button>
          </div>
        </div>

        <div className="bg-[#273142] h-[680px] rounded-xl px-12">
          <div className="text-white font-saira flex flex-row justify-evenly items-center pt-8 pb-16 text-lg">
            <div className="flex flex-col">
              <span className="pb-2">Chủ sở hữu</span>
              <span>
                Tên: {invoiceInfo.user.firstName} {invoiceInfo.user.lastName}
              </span>
              <span>Email: {invoiceInfo.user.email}</span>
            </div>

            <div className="flex flex-col">
              <span className="pb-2">Lịch chiếu</span>
              <span>
                Phim: {invoiceInfo.showtime?.movie?.name ?? "Không có dữ liệu"}
              </span>
              <span>
                Ngày: {invoiceInfo.showtime?.date ?? "Không có dữ liệu"}
              </span>
              <span>
                Giờ:{" "}
                {invoiceInfo.showtime
                  ? `${invoiceInfo.showtime.startTime.slice(
                      0,
                      5
                    )} - ${invoiceInfo.showtime.endTime.slice(0, 5)}`
                  : "Không có dữ liệu"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="pb-2">Rạp</span>
              <span>
                Tên: {invoiceInfo.showtime?.theater?.name ?? "Không có dữ liệu"}
              </span>
              <span>
                Vị trí:{" "}
                {invoiceInfo.showtime?.theater?.location ?? "Không có dữ liệu"}
              </span>
            </div>

            <div className="flex flex-col space-y-2 line-clamp-2">
              <span className="break-words max-w-[180px] inline-block">
                Đồ ăn:{" "}
                {Array.isArray(invoiceInfo.foods) &&
                invoiceInfo.foods.length > 0
                  ? invoiceInfo.foods.map((food, index) => (
                      <span key={index}>
                        {`${(food.price * food.quantity).toLocaleString(
                          "vi-VN"
                        )}đ - (${food.name} x${food.quantity})`}
                        {index < invoiceInfo.foods.length - 1 && ", "}
                      </span>
                    ))
                  : "Không có đồ ăn"}
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
                  ? "Khác"
                  : "Không sử dụng voucher"}
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <span>Ngày hóa đơn: {invoiceInfo.date}</span>
              <span>Giờ hóa đơn: {invoiceInfo.time.slice(0, 5)}</span>
            </div>
          </div>

          <div className="grid grid-cols-5">
            {["STT", "Mô tả", "Hàng", "Cột", "Giá"].map((title, idx) => (
              <div
                key={idx}
                className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                  idx === 0 ? "rounded-tl-xl rounded-bl-xl" : ""
                } ${idx === 4 ? "rounded-tr-xl rounded-br-xl" : ""}`}
              >
                {title}
              </div>
            ))}
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
                      Tổng:
                    </span>
                    <span className="w-full text-center">
                      {totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-white text-center py-4">
                Không tìm thấy thông tin
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default InvoiceDetailPage;
