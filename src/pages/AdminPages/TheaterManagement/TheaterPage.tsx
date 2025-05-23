import React, { useEffect, useState } from "react";
import { TheaterType } from "../Data/Data";
import { Button, Popconfirm } from "antd";
import { IoIosSearch } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ModalCreateUpdateTheater from "../MoviePage/ModalCreateUpdateTheater.tsx";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import {
  deleteTheater,
  getAllTheaters,
} from "../../../redux/Slices/TheaterSlice.tsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdOutlineChair } from "react-icons/md";

const TheaterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, isLoading, listTheaters } = useAppSelector(
    (state) => state.theater
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [selectedItem, setSelectedItem] = useState<TheaterType | null>(null); // State to store the selected genre for editing
  const genresPerPage = 15;

  useEffect(() => {
    dispatch(getAllTheaters());
  }, [dispatch]);

  const filteredData = listTheaters.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / genresPerPage);

  const startIndex = (currentPage - 1) * genresPerPage;
  const endIndex = startIndex + genresPerPage;
  const currentGenres = filteredData.slice(startIndex, endIndex);

  const showTheaterCus = (
    item: TheaterType,
    index: number,
    onEdit: (item: TheaterType) => void,
    onDelete: (item: TheaterType) => void,
    onAddRoom: (item: TheaterType) => void
  ) => {
    return (
      <div
        key={item.id}
        className={`grid grid-cols-3 bg-[#273142] text-white ${
          index === currentGenres.length - 1
            ? "rounded-b-xl"
            : "border-b border-[#979797]"
        }`}
      >
        <div className="flex justify-center items-center p-2 font-saira">
          {item.name}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.location}
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => onEdit(item)}
            className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797]"
          >
            <FaRegEdit />
          </button>
          <button
            onClick={() => onAddRoom(item)}
            className="bg-[#323D4E] h-[32px] px-4 py-2 border-r border-[#979797]"
          >
            <MdOutlineChair />
          </button>
          <Popconfirm
            title={
              <span className="font-saira text-sm">
                Are you sure to delete this theater?
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
            <button className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg">
              <FaRegTrashCan color="red" />
            </button>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const handleClickEdit = (item: TheaterType) => {
    setSelectedItem(item); // Set the selected genre for editing
    setIsModalOpen(true); // Open the modal
  };

  const handleClickDelete = (item: TheaterType) => {
    dispatch(deleteTheater({ theaterId: item.id }));
    toast.success("Theater deleted successfully!");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClickAddRoom = (item: TheaterType) => {
    navigate(`${item.id}`, { state: item });
  };

  return (
    <div className="relative min-h-[600px]">
      <div className="flex justify-between items-center">
        <span className="text-white text-3xl font-saira">Theater</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#323D4E] px-4 rounded-full space-x-2">
            <IoIosSearch size={20} color="gray" />
            <input
              className="bg-[#323D4E] w-[253px] h-[38px] focus:outline-none text-white placeholder-gray-400 font-saira"
              type="text"
              placeholder="Search theater name"
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
              transition: "background-color 0.3s ease, border-color 0.3s ease",
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
              setSelectedItem(null); // Set to null when adding new genre
              setIsModalOpen(true); // Open modal to create new genre
            }}
          >
            Add New Theater
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="pt-8">
        <div className="grid grid-cols-3">
          {["Name", "Location", "Action"].map((title, idx) => (
            <div
              key={idx}
              className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full
        ${idx === 0 ? "rounded-tl-xl" : ""}
        ${idx === 2 ? "rounded-tr-xl" : ""}
      `}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[640px]">
          {currentGenres.length > 0 ? (
            currentGenres.map((item, index) =>
              showTheaterCus(
                item,
                index,
                handleClickEdit,
                handleClickDelete,
                handleClickAddRoom
              )
            )
          ) : (
            <div className="text-white text-center py-4">No genres found</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center pt-8">
        <span className="text-white font-saira px-4">
          Showing {Math.min(startIndex + 1, totalItems)}-
          {Math.min(endIndex, totalItems)} of {totalItems}
        </span>
        <div className="flex items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797] ${
              currentPage === 1 ? "opacity-50" : ""
            }`}
            disabled={currentPage === 1}
          >
            <FaAngleLeft color="white" />
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg ${
              currentPage === totalPages ? "opacity-50" : ""
            }`}
            disabled={currentPage === totalPages}
          >
            <FaAngleRight color="white" />
          </button>
        </div>
      </div>

      <ModalCreateUpdateTheater
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal
        initialData={selectedItem} // Pass selected genre for editing
      />
    </div>
  );
};

export default TheaterPage;
