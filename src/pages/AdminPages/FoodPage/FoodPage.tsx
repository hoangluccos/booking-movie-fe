import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { useEffect, useState } from "react";
import { FoodType } from "../Data/Data";
import {
  Button,
  ConfigProvider,
  Popconfirm,
  Tooltip,
  Skeleton,
  Empty,
} from "antd";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { deleteFood, getAllFoods } from "../../../redux/slices/FoodSlice.tsx";
import { toast } from "react-toastify";
import ModalCreateUpdateFood from "./ModalCreateUpdateFood.tsx";

const FoodPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, listLoading, listFoods } = useAppSelector(
    (state) => state.food
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);

  useEffect(() => {
    dispatch(getAllFoods());
  }, [dispatch]);

  const filteredData = listFoods.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickEditMovie = (item: FoodType) => {
    setSelectedFood(item);
    setModalOpen(true);
  };

  const handleClickDeleteMovie = async (item: FoodType) => {
    try {
      await dispatch(deleteFood({ foodId: item.id })).unwrap();
      toast.success("Food deleted successfully!");
      dispatch(getAllFoods());
    } catch (error) {
      toast.error("Failed to delete food.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFood(null);
  };

  const showFoodCus = (
    item: FoodType,
    onEdit: (item: FoodType) => void,
    onDelete: (item: FoodType) => void
  ) => {
    return (
      <div className="bg-[#273142] rounded-xl overflow-hidden shadow-lg">
        <img src={item.image} className="w-full h-[200px] object-cover" />
        <div className="p-4">
          <div className="flex flex-row justify-between">
            <div>
              <h3 className="text-white text-lg font-saira mb-1 overflow-hidden line-clamp-2 min-h-[48px] leading-[1.2]">
                {item.name}
              </h3>
              <p className="text-blue-400 text-sm mb-4 font-saira">
                {item.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="flex items-center">
              <Popconfirm
                title={
                  <span className="font-saira text-sm">
                    Are you sure to delete this person?
                  </span>
                }
                description={
                  <span className="font-saira text-sm">
                    {`Name: "${item.name}"`}
                  </span>
                }
                onConfirm={() => onDelete(item)}
                onCancel={() => {}}
                okText={<span className="font-saira">Yes</span>}
                cancelText={<span className="font-saira">No</span>}
                okType="danger"
              >
                <Button
                  shape="circle"
                  danger
                  icon={<FaRegTrashCan />}
                  className="hover:scale-110 transform transition duration-200"
                  style={{
                    backgroundColor: "#404B5D",
                    borderColor: "#404B5D",
                    color: "#FF0000",
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>
            </div>
          </div>
          <Button
            className="w-[126px] h-[38px] rounded-lg font-saira hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out"
            style={{
              backgroundColor: "#404B5D",
              borderColor: "#404B5D",
              padding: "8px 48px",
              borderRadius: "8px",
              color: "#FFFFFF",
              transition:
                "background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => onEdit(item)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#556178";
              e.currentTarget.style.borderColor = "#556178";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#404B5D";
              e.currentTarget.style.borderColor = "#404B5D";
            }}
          >
            Edit Food
          </Button>
        </div>
      </div>
    );
  };

  const renderSkeleton = () =>
    [...Array(8)].map((_, idx) => (
      <div
        key={idx}
        className="bg-[#273142] rounded-xl overflow-hidden shadow-lg w-full"
      >
        {/* Skeleton for the image */}
        <div className="w-full h-[200px] bg-gray-500">
          <Skeleton.Image
            active
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#3A4657",
            }}
          />
        </div>
        <div className="p-4">
          {/* Skeleton for name (2 lines) */}
          <Skeleton
            active
            title={{ width: "80%" }}
            paragraph={{ rows: 2, width: ["80%", "60%"] }}
            style={{ marginBottom: 8 }}
          />
          {/* Skeleton for price */}
          <Skeleton
            active
            title={{ width: "50%" }}
            paragraph={false}
            style={{ marginBottom: 16 }}
          />
          {/* Skeleton for buttons */}
          <div className="flex justify-between">
            <Skeleton.Button
              active
              size="small"
              style={{
                width: 126,
                height: 38,
                borderRadius: 8,
                marginRight: 8,
              }}
            />
            <Skeleton.Button
              active
              size="small"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </div>
        </div>
      </div>
    ));

  return (
    <ConfigProvider
      theme={{
        components: {
          Tooltip: {
            colorBgSpotlight: "#1F2937",
            colorTextLightSolid: "#FFFFFF",
            borderRadius: 6,
            fontSize: 13,
            padding: 8,
            fontFamily: "Saira, sans-serif",
          },
          Popconfirm: {
            fontFamily: "Saira, sans-serif",
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
      <div className="relative min-h-[750px] space-y-6">
        {/* Title Page */}
        <div className="flex-row flex justify-between items-center">
          <span className="text-white text-3xl font-saira">Foods</span>
          <div className="flex items-center space-x-4">
            <div className="flex-row flex items-center bg-[#323D4E] px-4 rounded-full space-x-2">
              <IoIosSearch size={20} color="gray" />
              <input
                className="bg-[#323D4E] w-[253px] h-[38px] focus:outline-none text-white placeholder-gray-400 font-saira"
                type="text"
                placeholder="Search food name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              type="primary"
              className="w-[147px] h-[48px] rounded-lg font-saira"
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
              onClick={() => {
                setSelectedFood(null);
                setModalOpen(true);
              }}
            >
              Add New Food
            </Button>
          </div>
        </div>

        {/* Modal */}
        <ModalCreateUpdateFood
          open={modalOpen}
          onClose={handleCloseModal}
          initialData={selectedFood}
        />

        {/* Body */}
        <div className="grid grid-cols-4 gap-6 max-h-[705px] overflow-y-auto scrollbar-hidden">
          {listLoading ? (
            renderSkeleton()
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id}>
                {showFoodCus(
                  item,
                  handleClickEditMovie,
                  handleClickDeleteMovie
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center col-span-full min-h-[400px]">
              <Empty
                description={
                  <span className="text-white font-saira">No foods found</span>
                }
              />
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default FoodPage;
