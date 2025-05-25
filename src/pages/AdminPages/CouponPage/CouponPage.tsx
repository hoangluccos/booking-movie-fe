import {
  Button,
  ConfigProvider,
  Popconfirm,
  Tooltip,
  DatePicker,
  Popover,
  Switch,
  Skeleton,
  Empty,
} from "antd";
import { useEffect, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaRegEdit,
  FaFilter,
  FaAngleDown,
} from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { CouponType } from "../Data/Data.tsx";
import {
  deleteCoupon,
  getAllCoupons,
  toggleCouponStatus,
} from "../../../redux/slices/CouponSlice.tsx";
import { toast } from "react-toastify";

// Define filter interface
interface Filters {
  discountType: string[];
  status: string[];
  startDate: string;
  endDate: string;
}

// Utility function to format numbers with thousand separators
const formatNumber = (value: number): string => {
  if (value > 1000) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return value.toString();
};

// Utility function to format date from YYYY-MM-DD to DD-MM-YYYY
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "Invalid Date";
  const parsedDate = dayjs(dateStr, "YYYY-MM-DD");
  return parsedDate.isValid()
    ? parsedDate.format("DD-MM-YYYY")
    : "Invalid Date";
};

const CouponPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { listCoupons, isLoading } = useAppSelector((state) => state.coupon);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    discountType: [],
    status: [],
    startDate: "",
    endDate: "",
  });
  const [tempFilters, setTempFilters] = useState<Filters>({
    discountType: [],
    status: [],
    startDate: "",
    endDate: "",
  });

  const [discountTypePopoverOpen, setDiscountTypePopoverOpen] = useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);

  // Dynamic options for discount types and status
  const discountTypeOptions = Array.from(
    new Set(listCoupons.map((item) => item.discountType))
  ).map((type) => ({
    label: type,
    value: type,
  }));

  const statusOptions = ["Active", "Inactive"].map((status) => ({
    label: status,
    value: status,
  }));

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  // Filter logic
  const filteredCoupons = listCoupons.filter((item) => {
    const matchDiscountType =
      !filters.discountType.length ||
      filters.discountType.includes(item.discountType);
    const matchStatus =
      !filters.status.length ||
      (filters.status.includes("Active") && item.status) ||
      (filters.status.includes("Inactive") && !item.status);

    // Convert dates to Dayjs objects for comparison
    const itemStartDate = dayjs(item.startDate, "YYYY-MM-DD");
    const itemEndDate = dayjs(item.endDate, "YYYY-MM-DD");
    const filterStartDate = filters.startDate
      ? dayjs(filters.startDate, "DD-MM-YYYY", true)
      : null;
    const filterEndDate = filters.endDate
      ? dayjs(filters.endDate, "DD-MM-YYYY", true)
      : null;

    // Validate dates
    if (!itemStartDate.isValid() || !itemEndDate.isValid()) {
      console.warn(
        `Invalid date for coupon ${item.id}: startDate=${item.startDate}, endDate=${item.endDate}`
      );
      return false;
    }
    if (filterStartDate && !filterStartDate.isValid()) {
      console.warn(`Invalid filter startDate: ${filters.startDate}`);
      return false;
    }
    if (filterEndDate && !filterEndDate.isValid()) {
      console.warn(`Invalid filter endDate: ${filters.endDate}`);
      return false;
    }

    // Date filtering logic
    let matchDate = true;

    // Case 1: Only filterStartDate is set
    if (filterStartDate && !filterEndDate) {
      matchDate = itemStartDate.isSame(filterStartDate, "day");
    }
    // Case 2: Only filterEndDate is set
    else if (!filterStartDate && filterEndDate) {
      matchDate = itemEndDate.isSame(filterEndDate, "day");
    }
    // Case 3: Both filterStartDate and filterEndDate are set
    else if (filterStartDate && filterEndDate) {
      matchDate =
        (itemStartDate.isSame(filterStartDate, "day") ||
          itemStartDate.isAfter(filterStartDate)) &&
        (itemEndDate.isSame(filterEndDate, "day") ||
          itemEndDate.isBefore(filterEndDate));
    }

    return matchDiscountType && matchStatus && matchDate;
  });

  const couponsPerPage = 5;
  const totalItems = filteredCoupons.length;
  const totalPages = Math.ceil(totalItems / couponsPerPage);
  const startIndex = (currentPage - 1) * couponsPerPage;
  const endIndex = startIndex + couponsPerPage;
  const currentCoupons = filteredCoupons.slice(startIndex, endIndex);

  const handleClickEditCoupon = (item: CouponType) => {
    navigate(`/admin/coupons/edit/${item.id}`, { state: { coupon: item } });
  };

  const handleClickDeleteCoupon = async (item: CouponType) => {
    dispatch(deleteCoupon({ couponId: item.id }));
    toast.success("Coupon deleted successfully!");
  };

  const handleToggleStatus = (item: CouponType) => {
    dispatch(toggleCouponStatus({ couponId: item.id }));
    toast.success(
      `Coupon status updated to ${item.status ? "Inactive" : "Active"}!`
    );
  };

  const resetFilters = () => {
    setFilters({ discountType: [], status: [], startDate: "", endDate: "" });
    setTempFilters({
      discountType: [],
      status: [],
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setDiscountTypePopoverOpen(false);
    setStatusPopoverOpen(false);
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    const formattedDate = date ? date.format("DD-MM-YYYY") : "";
    setTempFilters((prev) => ({ ...prev, startDate: formattedDate }));
    setFilters((prev) => ({ ...prev, startDate: formattedDate }));
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    const formattedDate = date ? date.format("DD-MM-YYYY") : "";
    setTempFilters((prev) => ({ ...prev, endDate: formattedDate }));
    setFilters((prev) => ({ ...prev, endDate: formattedDate }));
    setCurrentPage(1);
  };

  const showCouponCus = (
    item: CouponType,
    isLastRow: boolean,
    onEdit: (item: CouponType) => void,
    onDelete: (item: CouponType) => void,
    onToggleStatus: (item: CouponType) => void
  ) => (
    <div
      className={`grid grid-cols-10 bg-[#273142] text-white ${
        isLastRow ? "rounded-b-xl" : "border-b border-[#979797]"
      }`}
    >
      <div className="flex justify-center items-center p-2 font-saira">
        {item.code}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.discountType}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {formatNumber(item.discountValue)}
        {item.discountType === "Percentage" ? "%" : ""}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {formatDate(item.startDate)}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {formatDate(item.endDate)}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {formatNumber(item.minValue)}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        <div className="truncate max-w-[150px]">{item.description}</div>
      </div>
      <div className="flex justify-center items-center p-2">
        <img
          src={item.image || "path/to/fallback-image.jpg"}
          alt={item.code}
          className="w-44 h-[92px] rounded object-cover"
        />
      </div>
      <div className="flex justify-center items-center p-2">
        <Switch
          checked={item.status}
          onChange={() => onToggleStatus(item)}
          className="bg-[#323D4E]"
        />
      </div>
      <div className="flex justify-center items-center">
        <Tooltip title="Edit">
          <button
            onClick={() => onEdit(item)}
            className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797]"
          >
            <FaRegEdit />
          </button>
        </Tooltip>
        <Tooltip title="Delete">
          <Popconfirm
            title={
              <span className="font-saira text-sm text-white">
                Are you sure to delete this coupon?
              </span>
            }
            onConfirm={() => onDelete(item)}
            onCancel={() => {}}
            okText={<span className="font-saira">Yes</span>}
            cancelText={<span className="font-saira">No</span>}
            okType="danger"
          >
            <button className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg">
              <FaRegTrashCan color="red" />
            </button>
          </Popconfirm>
        </Tooltip>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div>
      {[...Array(5)].map((_, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-10 bg-[#273142] text-white min-h-[92px] ${
            idx === 4 ? "rounded-b-xl" : "border-b border-[#979797]"
          }`}
        >
          {[...Array(8)].map((_, colIdx) => (
            <div
              key={colIdx}
              className="flex items-center justify-center font-saira"
            >
              <Skeleton
                active
                title
                paragraph={false}
                style={{ width: "90%" }}
              />
            </div>
          ))}
          <div className="flex items-center justify-center">
            <Skeleton.Button
              active
              size="small"
              style={{ width: 32, height: 32, borderRadius: 8 }}
            />
          </div>
          <div className="flex justify-center items-center">
            <Skeleton.Button
              active
              size="small"
              style={{
                width: 64,
                height: 32,
                borderRadius: "8px 0 0 8px",
                marginRight: 1,
              }}
            />
            <Skeleton.Button
              active
              size="small"
              style={{ width: 64, height: 32, borderRadius: "0 8px 8px 0" }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPaginationInfo = () => {
    if (isLoading) {
      return (
        <Skeleton
          active
          title={{ width: "120px" }}
          paragraph={false}
          style={{ marginTop: 8 }}
        />
      );
    }
    if (totalItems === 0) {
      return <span className="text-white font-saira">Showing 0-0 of 0</span>;
    }
    return (
      <span className="text-white font-saira">
        Showing {Math.min(startIndex + 1, totalItems)}-
        {Math.min(endIndex, totalItems)} of {totalItems}
      </span>
    );
  };

  const renderPaginationButtons = () => {
    if (isLoading) {
      return (
        <div className="flex">
          <Skeleton.Button
            active
            size="small"
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px 0 0 8px",
              marginRight: 1,
            }}
          />
          <Skeleton.Button
            active
            size="small"
            style={{ width: 32, height: 32, borderRadius: "0 8px 8px 0" }}
          />
        </div>
      );
    }
    return (
      <div className="flex">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797] ${
            currentPage === 1 || totalItems === 0 ? "opacity-50" : ""
          }`}
          disabled={currentPage === 1 || totalItems === 0}
        >
          <FaAngleLeft color="white" />
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg ${
            currentPage === totalPages || totalItems === 0 ? "opacity-50" : ""
          }`}
          disabled={currentPage === totalPages || totalItems === 0}
        >
          <FaAngleRight color="white" />
        </button>
      </div>
    );
  };

  const SelectablePopover = (
    options: { label: string; value: string }[],
    selected: string[],
    setSelected: (value: string[]) => void,
    setOpen: (val: boolean) => void,
    type: "discountType" | "status"
  ) => {
    const title = type === "discountType" ? "Discount Type" : "Status";

    return (
      <div className="w-[400px] p-4 bg-[#323D4E] rounded-lg text-white font-saira">
        <div className="mb-4 text-lg">Select {title}</div>
        <div className="grid grid-cols-3 gap-2">
          {options.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <div
                key={item.value}
                className={`px-2 py-1 justify-center items-center flex text-center cursor-pointer border rounded text-sm ${
                  isSelected
                    ? "bg-[#4880FF] text-white border-[#4880FF]"
                    : "bg-transparent text-white border-gray-400"
                }`}
                onClick={() => {
                  setSelected(
                    isSelected
                      ? selected.filter((val) => val !== item.value)
                      : [...selected, item.value]
                  );
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-gray-400 mt-3 italic">
          *You can choose multiple {title.toUpperCase()}
        </div>
        <div className="flex justify-center items-center">
          <Button
            type="primary"
            className="mt-4 w-[129px] h-[36px] text-sm"
            onClick={applyFilters}
          >
            Apply Now
          </Button>
        </div>
      </div>
    );
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
          Switch: {
            colorPrimary: "#4880FF",
            colorPrimaryHover: "#4880FF",
          },
          Skeleton: {
            color: "#3A4657",
            colorGradientEnd: "#2A3444",
          },
          Empty: {
            colorText: "#FFFFFF",
            colorTextDescription: "#FFFFFF",
          },
        },
      }}
    >
      <div className="min-h-[750px] relative">
        {/* Title + Button */}
        <div className="flex flex-wrap justify-between items-center mb-3">
          <span className="text-white text-3xl font-saira">Coupons</span>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              type="primary"
              className="w-[147px] h-[48px] rounded-lg font-saira text-white bg-[#3b82f6] hover:!bg-[#2563eb] hover:!border-[#2563eb] transition-colors duration-300"
              style={{
                borderColor: "#3b82f6",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/admin/coupons/create")}
            >
              Add New Coupon
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-4 mb-6 text-white font-saira text-sm">
          <FaFilter size={25} />
          <span className="font-saira">Filter By</span>

          {/* Discount Type Popover */}
          <Popover
            title={null}
            trigger="click"
            open={discountTypePopoverOpen}
            onOpenChange={(open) => setDiscountTypePopoverOpen(open)}
            content={SelectablePopover(
              discountTypeOptions,
              tempFilters.discountType,
              (val) =>
                setTempFilters((prev) => ({ ...prev, discountType: val })),
              setDiscountTypePopoverOpen,
              "discountType"
            )}
            placement="bottomLeft"
          >
            <Button
              className="w-[180px] h-[48px] rounded-md font-saira flex items-center justify-between px-3 bg-[#323D4E] text-white"
              style={{ border: "transparent" }}
            >
              {filters.discountType.length > 0
                ? `${filters.discountType.length} Discount Types`
                : "Discount Type"}
              <FaAngleDown />
            </Button>
          </Popover>

          {/* Status Popover */}
          <Popover
            title={null}
            trigger="click"
            open={statusPopoverOpen}
            onOpenChange={(open) => setStatusPopoverOpen(open)}
            content={SelectablePopover(
              statusOptions,
              tempFilters.status,
              (val) => setTempFilters((prev) => ({ ...prev, status: val })),
              setStatusPopoverOpen,
              "status"
            )}
            placement="bottomLeft"
          >
            <Button
              className="w-[180px] h-[48px] rounded-md font-saira flex items-center justify-between px-3 bg-[#323D4E] text-white"
              style={{ border: "transparent" }}
            >
              {filters.status.length > 0
                ? `${filters.status.length} Statuses`
                : "Status"}
              <FaAngleDown />
            </Button>
          </Popover>

          {/* Start Date Picker */}
          <DatePicker
            allowClear
            placeholder="Start Date"
            className="w-[180px] h-[48px] rounded-md font-saira"
            format="DD-MM-YYYY"
            onChange={handleStartDateChange}
            value={
              filters.startDate ? dayjs(filters.startDate, "DD-MM-YYYY") : null
            }
            style={{ backgroundColor: "#323D4E" }}
          />

          {/* End Date Picker */}
          <DatePicker
            allowClear
            placeholder="End Date"
            className="w-[180px] h-[48px] rounded-md font-saira"
            format="DD-MM-YYYY"
            onChange={handleEndDateChange}
            value={
              filters.endDate ? dayjs(filters.endDate, "DD-MM-YYYY") : null
            }
            style={{ backgroundColor: "#323D4E" }}
          />

          {/* Reset Filter Button */}
          <Button
            onClick={resetFilters}
            className="w-[147px] h-[48px] rounded-md font-saira flex items-center px-3 bg-[#323D4E] text-white"
            style={{ border: "transparent" }}
          >
            <span className="text-xl">↺</span> Reset Filter
          </Button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-10">
          {[
            "Code",
            "Discount Type",
            "Discount Value",
            "Start Date",
            "End Date",
            "Min Value",
            "Description",
            "Image",
            "Status",
            "Action",
          ].map((title, idx) => (
            <div
              key={idx}
              className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                idx === 0 ? "rounded-tl-xl" : ""
              } ${idx === 9 ? "rounded-tr-xl" : ""}`}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="bg-[#273142] rounded-b-xl">
          {isLoading ? (
            renderSkeleton()
          ) : currentCoupons.length > 0 ? (
            currentCoupons.map((item, index) => (
              <div key={item.id}>
                {showCouponCus(
                  item,
                  index === currentCoupons.length - 1 &&
                    currentCoupons.length < 4,
                  handleClickEditCoupon,
                  handleClickDeleteCoupon,
                  handleToggleStatus
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center min-h-[184px]">
              <Empty
                description={
                  <span className="text-white font-saira">
                    No coupons found
                  </span>
                }
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center pt-4 space-x-4">
          {renderPaginationInfo()}
          <div className="flex items-center space-x-4">
            {renderPaginationButtons()}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CouponPage;
