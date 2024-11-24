import React, { useEffect, useState } from "react";
import instance from "../../../api/instance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function GenrePage() {
  const [genres, setGenres] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newGenre, setNewGenre] = useState("");

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
    setEditedValue(currentName);
  };

  const handleSaveClick = async (id) => {
    try {
      const payload = { name: editedValue };
      const res = await instance.put(`/genres/${id}`, payload);

      if (res.data && res.data.message === "Update Genre Success") {
        toast.success("Update Person thành công!");
        setGenres((prevGenres) =>
          prevGenres.map((genre) =>
            genre.id === id ? { ...genre, name: editedValue } : genre
          )
        );

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
    setIsAdding(true);
  };

  const handleAddSave = async () => {
    try {
      const payload = { name: newGenre };
      const res = await instance.post("/genres/", payload);

      if (res.data && res.data.message === "Create Genre Success") {
        const createdGenre = res.data.result;
        setGenres((prevGenres) => [...prevGenres, createdGenre]);
        toast.success("Add Person thành công!");
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
    setIsAdding(false);
    setNewGenre("");
  };
  const handleDeleteClick = async (id) => {
    try {
      const res = await instance.delete(`/genres/${id}`);
      toast.success(res.data.message);
      setTimeout(() => {
        setGenres((prevGenres) =>
          prevGenres.filter((genre) => genre.id !== id)
        );
      }, 1000);
    } catch (error) {
      console.error("Error deleting genre:", error);
      alert("Xóa thể loại thất bại!");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
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
            {/* <th className="border border-gray-300 px-4 py-2 text-left">ID</th> */}
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
                {/* <td className="border border-gray-300 px-4 py-2">{genre.id}</td> */}
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
                    <>
                      <button
                        onClick={() => handleEditClick(genre.id, genre.name)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-blue-600 mr-2"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(genre.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </>
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
