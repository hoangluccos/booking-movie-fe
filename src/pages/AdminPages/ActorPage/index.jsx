import React, { useState, useEffect } from "react";
import instance from "../../../api/instance";
import instanceImg from "../../../assets/profile.png";

function DirectorPage() {
  const [actors, setActors] = useState([]);
  const [newActor, setNewActor] = useState({
    name: "",
    gender: true,
    dateOfBirth: "",
    image: "",
    jobName: "Actor",
  });
  const [editingActor, setEditingActor] = useState(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await instance.get("/persons/", {
          params: { jobName: "Actor" },
        });
        console.log(response.data.result);
        setActors(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchActors();
  }, []);

  const handleAddActor = async (e) => {
    e.preventDefault();

    const formattedActorData = {
      name: newActor.name,
      gender: newActor.gender,
      dateOfBirth: newActor.dateOfBirth,
    };

    const formData = new FormData();
    formData.append(
      "createPersonRequest",
      new Blob([JSON.stringify(formattedActorData)], {
        type: "application/json",
      })
    );

    if (newActor.image) {
      formData.append("file", newActor.image);
    }

    try {
      const response = await instance.post("/persons/actor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response.data.code === 200) {
        setActors([...actors, response.data.result]);
        setNewActor({
          name: "",
          gender: true,
          dateOfBirth: "",
          image: "",
          jobName: "Actor",
        });
      }
    } catch (error) {
      console.error("Error adding actor:", error);
      alert("Failed to add actor.");
    }
  };

  const handleEditActor = (actor) => {
    let formattedDateOfBirth = "";
    console.log(actor);
    if (actor.dateOfBirth) {
      // Chuyển đổi từ DD/MM/YYYY sang YYYY-MM-DD
      const dateParts = actor.dateOfBirth.split("-"); // Tách ngày theo dấu "-"
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts; // Lưu ngày, tháng, năm
        formattedDateOfBirth = `${year}-${month.padStart(
          2,
          "0"
        )}-${day.padStart(2, "0")}`; // Định dạng lại thành YYYY-MM-DD
      }
    }
    console.log(formattedDateOfBirth);

    // Cập nhật lại state với actor đã sửa đổi
    setEditingActor({ ...actor, dateOfBirth: formattedDateOfBirth });
  };

  const handleSaveActor = async () => {
    console.log(editingActor); // Kiểm tra giá trị của editingActor thay vì truyền trực tiếp actor

    const formattedActorData = {
      name: editingActor.name,
      gender: editingActor.gender,
      dateOfBirth: editingActor.dateOfBirth, // Đảm bảo đây là định dạng YYYY-MM-DD
      job: editingActor.jobName, // Job từ state
      image: editingActor.image, // Chuyển đổi thành base64 nếu cần hoặc gửi đường dẫn
    };

    try {
      const response = await instance.put(
        `/persons/${editingActor.id}`,
        formattedActorData,
        {
          headers: { "Content-Type": "application/json" }, // Đảm bảo Content-Type là application/json
        }
      );

      console.log(response.data);

      if (response.data.code === 200) {
        setActors(
          actors.map((a) =>
            a.id === editingActor.id ? response.data.result : a
          )
        );
        setEditingActor(null);
      }
    } catch (error) {
      console.error("Error saving actor:", error);
      alert("Failed to save actor.");
    }
  };

  const handleDeleteActor = async (actorId) => {
    const res = await instance.delete(`/persons/${actorId}`);
    console.log(res.data);
    setActors(actors.filter((actor) => actor.id !== actorId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh Sách Actor</h2>

      {/* Form thêm Actor */}
      <div className="mb-6">
        <input
          type="text"
          value={newActor.name}
          onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
          placeholder="Nhập tên Actor"
          className="border p-2 mr-4"
        />
        <div className="mb-4">
          <label className="mr-4">Giới Tính: </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="true"
              checked={newActor.gender === true}
              onChange={() => setNewActor({ ...newActor, gender: true })}
            />
            Nam
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="gender"
              value="false"
              checked={newActor.gender === false}
              onChange={() => setNewActor({ ...newActor, gender: false })}
            />
            Nữ
          </label>
        </div>
        <input
          type="date"
          value={newActor.dateOfBirth}
          onChange={(e) =>
            setNewActor({ ...newActor, dateOfBirth: e.target.value })
          }
          placeholder="Ngày Sinh"
          className="border p-2 mr-4"
        />
        <input
          type="file"
          onChange={(e) =>
            setNewActor({ ...newActor, image: e.target.files[0] })
          }
          className="border p-2 mb-4"
        />
        <button onClick={handleAddActor} className="bg-blue-500 text-white p-2">
          Thêm Actor
        </button>
      </div>

      {/* Danh sách Actor */}
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên</th>
            <th className="border px-4 py-2">Giới Tính</th>
            <th className="border px-4 py-2">Ngày Sinh</th>
            <th className="border px-4 py-2">Ảnh</th>
            <th className="border px-4 py-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {actors.map((actor) => (
            <tr key={actor.id}>
              <td className="border px-4 py-2">{actor.id}</td>
              <td className="border px-4 py-2">
                {editingActor && editingActor.id === actor.id ? (
                  <input
                    type="text"
                    value={editingActor.name}
                    onChange={(e) =>
                      setEditingActor({ ...editingActor, name: e.target.value })
                    }
                  />
                ) : (
                  actor.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editingActor && editingActor.id === actor.id ? (
                  <>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="true"
                        checked={editingActor.gender === true}
                        onChange={() =>
                          setEditingActor({ ...editingActor, gender: true })
                        }
                      />
                      Nam
                    </label>
                    <label className="ml-4">
                      <input
                        type="radio"
                        name="gender"
                        value="false"
                        checked={editingActor.gender === false}
                        onChange={() =>
                          setEditingActor({ ...editingActor, gender: false })
                        }
                      />
                      Nữ
                    </label>
                  </>
                ) : actor.gender ? (
                  "Nam"
                ) : (
                  "Nữ"
                )}
              </td>
              <td className="border px-4 py-2">
                {editingActor && editingActor.id === actor.id ? (
                  <input
                    type="date"
                    value={editingActor.dateOfBirth}
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                ) : (
                  actor.dateOfBirth
                )}
              </td>
              <td className="border px-4 py-2">
                {editingActor && editingActor.id === actor.id ? (
                  <input
                    type="file"
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        image: e.target.files[0],
                      })
                    }
                    className="border p-2"
                  />
                ) : (
                  <img
                    src={actor.image}
                    alt={actor.name}
                    className="w-16 h-16 object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = instanceImg;
                    }}
                  />
                )}
              </td>
              <td className="border px-4 py-2">
                {editingActor && editingActor.id === actor.id ? (
                  <button
                    onClick={() => handleSaveActor(editingActor)}
                    className="bg-green-500 text-white p-2"
                  >
                    Lưu
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditActor(actor)}
                      className="bg-yellow-500 text-white p-2 mr-2"
                    >
                      Chỉnh Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteActor(actor.id)}
                      className="bg-red-500 text-white p-2"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DirectorPage;
