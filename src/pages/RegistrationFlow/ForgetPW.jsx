import React, { useState } from "react";

const ForgetPW = ({ onSubmit }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    const personalInfo = {
      password: password,
      passwordConfirm: confirmPassword,
    };

    onSubmit(personalInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu mới"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Xác nhận mật khẩu"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Cập nhật mật khẩu
      </button>
    </form>
  );
};

export default ForgetPW;
