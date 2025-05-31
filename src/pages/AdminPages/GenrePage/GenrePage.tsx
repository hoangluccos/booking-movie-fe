import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaRegEdit, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Popconfirm,
  Skeleton,
  Empty,
  ConfigProvider,
  Tooltip,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { GenreType } from "../Data/Data";
import {
  deleteGenre,
  getAllGenres,
} from "../../../redux/slices/GenreSlice.tsx";
import ModalCreateUpdateGenre from "./ModalCreateUpdateGenre.tsx";
import { toast } from "react-toastify";
import { FaRegTrashCan } from "react-icons/fa6";

const GenrePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isLoading, listGenre } = useAppSelector(
    (state) => state.genre
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GenreType | null>(null);
  const genresPerPage = 15;

  useEffect(() => {
    dispatch(getAllGenres());
  }, [dispatch]);

  const filteredData = listGenre.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / genresPerPage);
  const startIndex = (currentPage - 1) * genresPerPage;
  const endIndex = startIndex + genresPerPage;
  const currentGenres = filteredData.slice(startIndex, endIndex);

  const handleEdit = (item: GenreType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: GenreType) => {
    dispatch(deleteGenre({ genreId: item.id }));
    toast.success("Genre deleted successfully!");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const renderSkeleton = () => (
    <div>
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-2 bg-[#273142] text-white min-h-[48px] ${
            idx === 3 ? "rounded-b-xl" : "border-b border-[#979797]"
          }`}
        >
          <div className="flex items-center justify-center font-saira">
            <Skeleton active title paragraph={false} style={{ width: "90%" }} />
          </div>
          <div className="flex justify-center items-center">
            <Skeleton.Button
              active
              size="small"
              style={{ width: 64, height: 32, borderRadius: 8, marginRight: 4 }}
            />
            <Skeleton.Button
              active
              size="small"
              style={{ width: 64, height: 32, borderRadius: 8 }}
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

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Button: {
            colorText: "#FFFFFF",
            colorBgContainer: "#3b82f6",
            colorBorder: "transparent",
            borderRadius: 8,
          },
          Popconfirm: {
            colorBgElevated: "#ffffff",
            colorText: "#000000",
            colorPrimary: "#ff4d4f",
            borderRadius: 8,
          },
          Skeleton: {
            color: "#3A4657",
            colorGradientEnd: "#2A3444",
          },
          Empty: {
            colorText: "#FFFFFF",
            colorTextDescription: "#FFFFFF",
          },
          Tooltip: {
            colorBgSpotlight: "#1F2937",
            colorTextLightSolid: "#FFFFFF",
            borderRadius: 6,
            fontSize: 13,
            padding: 8,
          },
        },
      }}
    >
      <div className="relative min-h-[750px] p-4">
        <div className="flex justify-between items-center">
          <span className="text-white text-3xl font-saira">Genres</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#323D4E] px-4 rounded-full space-x-2">
              <IoIosSearch size={20} color="gray" />
              <input
                className="bg-[#323D4E] w-[253px] h-[38px] focus:outline-none text-white placeholder-gray-400 font-saira"
                type="text"
                placeholder="Search genre name"
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
                setSelectedItem(null);
                setIsModalOpen(true);
              }}
            >
              Add New Genre
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="pt-8">
          <div className="grid grid-cols-2">
            {["Name", "Action"].map((title, idx) => (
              <div
                key={idx}
                className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                  idx === 0 ? "rounded-tl-xl" : "rounded-tr-xl"
                }`}
              >
                {title}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[136px] bg-[#273142] rounded-b-xl">
            {isLoading ? (
              renderSkeleton()
            ) : currentGenres.length > 0 ? (
              currentGenres.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-2 bg-[#273142] text-white ${
                    index === currentGenres.length - 1
                      ? "rounded-b-xl"
                      : "border-b border-[#979797]"
                  }`}
                >
                  <div className="flex justify-center items-center p-2 font-saira">
                    {item.name}
                  </div>
                  <div className="flex justify-center items-center">
                    <Tooltip title="Edit">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797]"
                      >
                        <FaRegEdit />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title={
                          <span className="font-saira text-sm">
                            Are you sure to delete this genre?
                          </span>
                        }
                        description={
                          <span className="font-saira text-sm">
                            {`Name: "${item.name}"`}
                          </span>
                        }
                        onConfirm={() => handleDelete(item)}
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
              ))
            ) : (
              <div className="flex justify-center items-center min-h-[136px]">
                <Empty
                  description={
                    <span className="text-white font-saira">
                      No genres found
                    </span>
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center pt-4 space-x-4">
          {renderPaginationInfo()}
          <div className="flex items-center space-x-4">
            {renderPaginationButtons()}
          </div>
        </div>

        {/* Modal to create/update genre */}
        <ModalCreateUpdateGenre
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedItem}
        />
      </div>
    </ConfigProvider>
  );
};

export default GenrePage;
