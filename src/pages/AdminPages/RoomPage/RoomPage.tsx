import { Button, Modal, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RoomType, SeatType, TheaterType } from "../Data/Data";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import { deleteRoom, getAllRooms } from "../../../redux/Slices/RoomSlice.tsx";
import { toast } from "react-toastify";

const RoomPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theaterItem = location.state as TheaterType;
  const dispatch = useAppDispatch();
  const { error, isLoading, listRooms } = useAppSelector((state) => state.room);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [modalRows, setModalRows] = useState<number>(0);
  const [modalCols, setModalCols] = useState<number>(0);

  const roomsPerPage = 15;

  useEffect(() => {
    dispatch(getAllRooms({ theaterId: theaterItem.id }));
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = listRooms.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const endIndex = startIndex + roomsPerPage;
  const currentRooms = filteredData.slice(startIndex, endIndex);

  const handleViewSeats = (room: RoomType) => {
    setSelectedSeats(room.seats);
    setModalRows(room.rows);
    setModalCols(room.columns);
    setIsModalOpen(true);
  };

  const renderSeatsGrid = () => {
    // Lưu seat object thay vì true
    const seatMap: Record<string, SeatType | undefined> = {};
    selectedSeats.forEach((seat) => {
      const key = `${seat.locateRow}${seat.locateColumn}`;
      seatMap[key] = seat;
    });

    const grid: JSX.Element[] = [];

    for (let r = 0; r < modalRows; r++) {
      const rowLabel = String.fromCharCode(65 + r); // 'A' + r
      const row: JSX.Element[] = [];

      for (let c = 1; c <= modalCols; c++) {
        const key = `${rowLabel}${c}`;
        const seat = seatMap[key];
        const isCouple = seat?.isCouple === true; // kiểm tra isCouple

        row.push(
          <div
            key={key}
            className={`w-10 h-10 flex justify-center items-center border rounded 
            ${isCouple ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
          >
            {key}
          </div>
        );
      }

      grid.push(
        <div key={r} className="flex space-x-2 mb-2">
          {row}
        </div>
      );
    }

    return grid;
  };

  const showRoomCus = (
    item: RoomType,
    index: number,
    onDelete: (item: RoomType) => void
  ) => {
    return (
      <div
        key={item.id}
        className={`grid grid-cols-5 bg-[#273142] text-white ${
          index === currentRooms.length - 1
            ? "rounded-b-xl"
            : "border-b border-[#979797]"
        }`}
      >
        <div className="flex justify-center items-center p-2 font-saira">
          {item.name}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.columns}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.rows}
        </div>
        <div
          className="flex justify-center items-center p-2 font-saira cursor-pointer underline text-blue-400"
          onClick={() => handleViewSeats(item)}
        >
          {item.seats.length} seats
        </div>
        <div className="flex justify-center items-center">
          <Popconfirm
            title={
              <span className="font-saira text-sm">
                Are you sure to delete this room?
              </span>
            }
            description={
              <span className="font-saira text-sm">{`Name: "${item.name}"`}</span>
            }
            onConfirm={() => onDelete(item)}
            okText={<span className="font-saira">Yes</span>}
            cancelText={<span className="font-saira">No</span>}
            okType="danger"
          >
            <button className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-lg">
              <FaRegTrashCan color="red" />
            </button>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const handleClickDelete = async (item: RoomType) => {
    try {
      await dispatch(
        deleteRoom({ theaterId: theaterItem.id, roomId: item.id })
      ).unwrap();
      toast.success("Room deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete room");
    }
  };

  const handleClickAddNewRoom = () => {
    navigate("create", { state: theaterItem });
  };

  return (
    <div className="relative min-h-[600px]">
      <div className="flex justify-between items-center">
        <span className="text-white text-3xl font-saira">
          {theaterItem.name}
        </span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#323D4E] px-4 rounded-full space-x-2">
            <IoIosSearch size={20} color="gray" />
            <input
              className="bg-[#323D4E] w-[253px] h-[38px] focus:outline-none text-white placeholder-gray-400 font-saira"
              type="text"
              placeholder="Search room name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            type="primary"
            className="w-[147px] h-[48px] rounded-lg font-saira"
            style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
            onClick={handleClickAddNewRoom}
          >
            Add New Room
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="pt-8">
        <div className="grid grid-cols-5">
          {["Name", "Column", "Row", "Seat", "Action"].map((title, idx) => (
            <div
              key={idx}
              className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full
              ${idx === 0 ? "rounded-tl-xl" : ""}
              ${idx === 4 ? "rounded-tr-xl" : ""}`}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[640px]">
          {currentRooms.length > 0 ? (
            currentRooms.map((item, index) =>
              showRoomCus(item, index, handleClickDelete)
            )
          ) : (
            <div className="text-white text-center py-4">No rooms found</div>
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

      {/* Modal to show seat grid */}
      <Modal
        open={isModalOpen}
        title={<span className="font-saira">Seat Arrangement</span>}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="p-4">
          {renderSeatsGrid()}
          <div className="mt-4 text-sm text-gray-500">
            * Green: Couple Seat | Gray: Normal Seat
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomPage;
