import React, { useState, useEffect } from "react";
import instance from "../../../api/instance";

const TheaterManagement = () => {
  const [theaters, setTheaters] = useState([]);
  const [newTheater, setNewTheater] = useState({ name: "", location: "" });
  const [editTheater, setEditTheater] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const response = await instance.get("/theaters/");
      setTheaters(response.data.result);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await instance.post("/theaters/", newTheater);
      setTheaters((prev) => [...prev, response.data.result]);
      setNewTheater({ name: "", location: "" });
    } catch (error) {
      console.error("Error creating theater:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await instance.put(
        `/theaters/${editTheater.id}`,
        editTheater
      );
      setTheaters((prev) =>
        prev.map((theater) =>
          theater.id === editTheater.id ? response.data.result : theater
        )
      );
      setEditTheater(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating theater:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/theaters/${id}`);
      setTheaters((prev) => prev.filter((theater) => theater.id !== id));
    } catch (error) {
      console.error("Error deleting theater:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản Lý Rạp Chiếu Phim
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Thêm Rạp Mới</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Tên rạp"
            value={newTheater.name}
            onChange={(e) =>
              setNewTheater({ ...newTheater, name: e.target.value })
            }
            className="p-2 border rounded w-1/2"
          />
          <input
            type="text"
            placeholder="Vị trí"
            value={newTheater.location}
            onChange={(e) =>
              setNewTheater({ ...newTheater, location: e.target.value })
            }
            className="p-2 border rounded w-1/2"
          />
          <button
            onClick={handleCreate}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Thêm
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Chỉnh Sửa Rạp</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Tên rạp"
              value={editTheater.name}
              onChange={(e) =>
                setEditTheater({ ...editTheater, name: e.target.value })
              }
              className="p-2 border rounded w-1/2"
            />
            <input
              type="text"
              placeholder="Vị trí"
              value={editTheater.location}
              onChange={(e) =>
                setEditTheater({ ...editTheater, location: e.target.value })
              }
              className="p-2 border rounded w-1/2"
            />
            <button
              onClick={handleUpdate}
              className="p-2 bg-green-500 text-white rounded"
            >
              Lưu
            </button>
            <button
              onClick={() => {
                setEditTheater(null);
                setIsEditing(false);
              }}
              className="p-2 bg-red-500 text-white rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Danh Sách Rạp</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Tên Rạp</th>
              <th className="border border-gray-300 p-2">Vị Trí</th>
              <th className="border border-gray-300 p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map((theater) => (
              <tr key={theater.id}>
                <td className="border border-gray-300 p-2">{theater.name}</td>
                <td className="border border-gray-300 p-2">
                  {theater.location}
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditTheater(theater);
                      setIsEditing(true);
                    }}
                    className="p-2 bg-yellow-500 text-white rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(theater.id)}
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TheaterManagement;
