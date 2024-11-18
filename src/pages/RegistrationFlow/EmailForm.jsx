import React, { useState } from "react";
import { Link } from "react-router-dom";

const EmailForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [err_value, setErr_value] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErr_value(!err_value);
      return;
    }
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <p className="mb-6 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-500 underline">
          Log in
        </Link>
      </p>
      <h2 className="text-2xl font-bold mb-4">Nhập Email</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email"
        className="p-2 border border-gray-300 rounded mb-4 w-80"
      />

      {err_value ? (
        <p className="text-red-500 mb-3">Vui lòng nhập Email</p>
      ) : (
        ""
      )}
      <button
        type="submit"
        className=" bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Gửi mã OTP
      </button>
    </form>
  );
};

export default EmailForm;
