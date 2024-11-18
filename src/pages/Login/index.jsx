import React from "react";
import instance from "../../api/instance";
import profileImage from "../../assets/profile.png";
import facebookIcon from "../../assets/facebook.png";
import googleIcon from "../../assets/google.png";
import cinemaImage from "../../assets/cinema1.jpg";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

function LoginForm() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await instance.post("/auth/login", data);
      if (res.data.code === 200) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", JSON.stringify(res.data.result));
        toast.success("Bạn đã đăng nhập thành công!");
        setTimeout(() => {
          nav("/");
        }, 2000);
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại");
      console.error("Login failed", error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${cinemaImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <ToastContainer />
      <div className="relative z-10 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 mx-auto mb-4 rounded-full"
        />
        <h3 className="text-2xl font-semibold text-center">Log in</h3>
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <div className="my-4 space-y-2">
          <button className="flex items-center justify-center w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            <img src={facebookIcon} alt="Facebook" className="w-5 h-5 mr-2" />
            Log in with Facebook
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
            Log in with Google
          </button>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("username")}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Your password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Log in
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Using website without login?
          <Link to="/" className="text-blue-500 hover:underline">
            <i class="fa-solid fa-house"></i>
            Home Page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
