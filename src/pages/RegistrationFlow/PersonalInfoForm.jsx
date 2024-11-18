import React, { useState } from "react";

const PersonalInfoForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("1");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !firstName || !lastName || !dateOfBirth) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const personalInfo = {
      username,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender: parseInt(gender),
      avatar: avatar || "avatar",
    };

    onSubmit(personalInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Nhập thông tin cá nhân</h2>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Tên đăng nhập"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Tên"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Họ"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <input
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        placeholder="Ngày sinh"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <div className="flex items-center mb-4">
        <label className="mr-2 text-gray-600">Giới tính:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="1">Nam</option>
          <option value="2">Nữ</option>
        </select>
      </div>

      <input
        type="text"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        placeholder="URL Avatar (Tùy chọn)"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Đăng ký
      </button>
    </form>
  );
};

export default PersonalInfoForm;
