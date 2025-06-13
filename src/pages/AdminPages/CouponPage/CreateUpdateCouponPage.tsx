import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ConfigProvider, DatePicker, Input, Button, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import {
  createCoupon,
  updateCoupon,
} from "../../../redux/slices/CouponSlice.tsx";
import { CouponType } from "../Data/Data.tsx";
import { LeftOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const CreateUpdateCouponPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const couponData = location.state?.coupon as CouponType;

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.coupon);

  const [coupon, setCoupon] = useState({
    code: "",
    discountType: "Other",
    discountValue: "",
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    minValue: "",
    description: "",
    image: null as File | null,
    existingImageUrl: "" as string,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isFormDataReady, setIsFormDataReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref để reset input file

  // Utility function to format numbers with thousand separators
  const formatNumber = (value: string | number): string => {
    const num = Number(value.toString().replace(/\./g, ""));
    if (isNaN(num)) return "";
    return num
      .toLocaleString("en-US", { useGrouping: true })
      .replace(/,/g, ".");
  };

  // Utility function to parse formatted number (e.g., "1.000.000" -> "1000000")
  const parseFormattedNumber = (value: string): string => {
    return value.replace(/\./g, "");
  };

  // Kiểm tra state từ location khi component mount
  useEffect(() => {
    if (location.state?.coupon && id) {
      setCoupon({
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue.toString(),
        startDate: couponData.startDate ? dayjs(couponData.startDate) : null,
        endDate: couponData.endDate ? dayjs(couponData.endDate) : null,
        minValue: couponData.minValue.toString(),
        description: couponData.description,
        image: null,
        existingImageUrl: couponData.image || "",
      });
      setPreview(couponData.image || null);
      setIsFormDataReady(true);
    } else {
      setIsFormDataReady(true);
    }
  }, [id, location.state, dispatch]);

  const handleChange = (name: string, value: string | File | null) => {
    if (typeof value !== "string") {
      setCoupon((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    let newValue = value;

    if (name === "discountValue") {
      if (coupon.discountType === "Percentage") {
        const numValue = Number(value);
        if (numValue < 0 || numValue > 100) {
          toast.error("Percentage value must be between 0 and 100.");
          return;
        }
      } else {
        const parsedValue = parseFormattedNumber(value);
        newValue = parsedValue || "1";
      }
    } else if (name === "minValue") {
      const parsedValue = parseFormattedNumber(value);
      newValue = parsedValue || "1";
    }

    setCoupon((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleDateChange = (date: Dayjs | null, name: string) => {
    setCoupon((prev) => ({ ...prev, [name]: date }));
  };

  const handleSelectChange = (value: string) => {
    setCoupon((prev) => ({
      ...prev,
      discountType: value,
      discountValue: value === "Percentage" ? "0" : prev.discountValue || "1",
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setCoupon((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
      setCoupon((prev) => ({ ...prev, image: null }));
    }
    console.log("File selected:", file); // Debug
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setCoupon((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = coupon.startDate
      ? coupon.startDate.format("YYYY-MM-DD")
      : null;
    const endDate = coupon.endDate ? coupon.endDate.format("YYYY-MM-DD") : null;

    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và kết thúc.");
      return;
    }

    const params = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue:
        parseFloat(parseFormattedNumber(coupon.discountValue)) || 1,
      startDate,
      endDate,
      minValue: parseFloat(parseFormattedNumber(coupon.minValue)) || 1,
      description: coupon.description,
    };

    try {
      if (id) {
        await dispatch(
          updateCoupon({
            couponId: id,
            couponData: params,
            image: coupon.image || coupon.existingImageUrl,
          })
        ).unwrap();
        toast.success("Coupon updated successfully!");
        setTimeout(() => navigate("/admin/coupons"), 1000);
      } else {
        await dispatch(
          createCoupon({ couponData: params, image: coupon.image })
        ).unwrap();
        toast.success("Coupon created successfully!");
        setTimeout(() => navigate("/admin/coupons"), 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "Fail to create or update coupon");
      console.log("Eror: ", error);
    }
  };

  const handleClickGoBack = () => {
    navigate(-1);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Select: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            optionSelectedBg: "#1e2632",
            selectorBg: "#323D4E",
            colorBgElevated: "#323D4E",
          },
          Input: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
          },
          DatePicker: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            colorBgElevated: "#323D4E",
          },
        },
      }}
    >
      <div className="text-white">
        {/* <ToastContainer /> */}
        <div className="flex items-center mb-8">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={handleClickGoBack}
            className="text-white mr-4 font-saira transition-all duration-300 ease-in-out hover:!text-blue-400 hover:scale-110"
          />
          <span className="text-3xl font-saira">
            {id ? "Edit Coupon" : "Add New Coupon"}
          </span>
        </div>
        <div className="w-full bg-[#273142] p-10 rounded-2xl shadow-lg max-h-[700px] overflow-y-scroll scrollbar-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Upload Image */}
            <div className="mb-8 flex flex-col items-center">
              <label className="text-white mb-2 block text-lg">
                Coupon Image
              </label>
              <div className="relative w-[600px] h-[250px] bg-[#323D4E] rounded-xl flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-center text-sm px-4 font-saira">
                    No image selected
                  </span>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef} // Gắn ref để reset input
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button
                  type="primary"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 font-saira !bg-blue-500 hover:!bg-blue-600 !text-white !text-sm !px-2 !py-1 !rounded-md"
                >
                  Select image
                </Button>
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Coupon Info */}
            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Coupon Code</label>
                <Input
                  name="code"
                  placeholder="Enter coupon code"
                  value={coupon.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Discount Type</label>
                <Select
                  placeholder="Select discount type"
                  value={coupon.discountType}
                  onChange={handleSelectChange}
                  style={{ width: "100%" }}
                >
                  <Select.Option value="Percentage">Percentage</Select.Option>
                  <Select.Option value="Fixed">Fixed</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Discount Value</label>
                <Input
                  type="text"
                  name="discountValue"
                  placeholder={
                    coupon.discountType === "Percentage"
                      ? "Enter percentage (0-100)"
                      : "Enter discount value"
                  }
                  value={
                    coupon.discountType === "Percentage"
                      ? coupon.discountValue
                      : formatNumber(coupon.discountValue)
                  }
                  onChange={(e) =>
                    handleChange("discountValue", e.target.value)
                  }
                  min={coupon.discountType === "Percentage" ? "0" : "1"}
                  max={coupon.discountType === "Percentage" ? "100" : undefined}
                  addonAfter={
                    coupon.discountType === "Percentage" ? "%" : undefined
                  }
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Minimum Value</label>
                <Input
                  type="text"
                  name="minValue"
                  placeholder="Enter minimum value"
                  value={formatNumber(coupon.minValue)}
                  onChange={(e) => handleChange("minValue", e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Start Date</label>
                <DatePicker
                  value={coupon.startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  format="DD-MM-YYYY"
                  placeholder="Select start date"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">End Date</label>
                <DatePicker
                  value={coupon.endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  format="DD-MM-YYYY"
                  placeholder="Select end date"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div className="col-span-2 flex flex-col">
                <label className="mb-2 font-saira">Description</label>
                <TextArea
                  name="description"
                  placeholder="Enter coupon description"
                  value={coupon.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  style={{ resize: "none" }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              className="mt-8 h-[56px] w-[274px]"
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
                padding: "8px 48px",
                borderRadius: "8px",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              loading={isLoading}
            >
              {id ? "Update Coupon" : "Add Now"}
            </Button>
          </form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreateUpdateCouponPage;
