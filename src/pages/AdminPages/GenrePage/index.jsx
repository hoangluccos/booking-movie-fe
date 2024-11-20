import React, { useEffect, useState } from "react";
import instance from "../../../api/instance";

function GenrePage() {
  const [genres, setGenres] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID của hàng đang được chỉnh sửa
  const [editedValue, setEditedValue] = useState(""); // Giá trị đã chỉnh sửa
  const [isAdding, setIsAdding] = useState(false); // Trạng thái thêm hàng mới
  const [newGenre, setNewGenre] = useState(""); // Giá trị của thể loại mới

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await instance.get("/genres/");
        setGenres(res.data.result);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditedValue(currentName); // Đặt giá trị input bằng tên hiện tại của thể loại
  };

  const handleSaveClick = async (id) => {
    try {
      // Gửi API PUT để cập nhật thể loại
      const payload = { name: editedValue }; // Payload phải tuân theo định dạng UpdateGenreRequest
      const res = await instance.put(`/genres/${id}`, payload);

      if (res.data && res.data.message === "Update Genre Success") {
        // Cập nhật lại danh sách thể loại trong bảng
        setGenres((prevGenres) =>
          prevGenres.map((genre) =>
            genre.id === id ? { ...genre, name: editedValue } : genre
          )
        );

        // Reset trạng thái chỉnh sửa
        setEditingId(null);
        setEditedValue("");
      } else {
        console.error("Unexpected response:", res.data);
      }
    } catch (error) {
      console.error("Error saving genre:", error);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true); // Kích hoạt trạng thái thêm hàng mới
  };

  const handleAddSave = async () => {
    try {
      // Gửi API POST để thêm thể loại mới
      const payload = { name: newGenre }; // Payload phải tuân theo định dạng CreateGenreRequest
      const res = await instance.post("/genres/", payload);

      if (res.data && res.data.message === "Create Genre Success") {
        const createdGenre = res.data.result; // Dữ liệu thể loại mới từ API
        setGenres((prevGenres) => [...prevGenres, createdGenre]);

        // Reset trạng thái thêm hàng mới
        setIsAdding(false);
        setNewGenre("");
      } else {
        console.error("Unexpected response:", res.data);
      }
    } catch (error) {
      console.error("Error adding genre:", error);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false); // Hủy thêm hàng mới
    setNewGenre("");
  };

  return (
    <div className="p-6">
      <h2 className="text-[30px] font-bold mb-4">Danh sách thể loại</h2>
      <button
        onClick={handleAddClick}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Tên thể loại
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {genres.length > 0 ? (
            genres.map((genre) => (
              <tr key={genre.id}>
                <td className="border border-gray-300 px-4 py-2">{genre.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingId === genre.id ? (
                    <input
                      type="text"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    genre.name
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {editingId === genre.id ? (
                    <button
                      onClick={() => handleSaveClick(genre.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(genre.id, genre.name)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-blue-600"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="text-center border border-gray-300 px-4 py-2"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
          {isAdding && (
            <tr>
              <td className="border border-gray-300 px-4 py-2">New</td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={handleAddSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GenrePage;
