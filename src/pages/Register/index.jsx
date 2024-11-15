import React from "react";
import {
  FaFacebook,
  FaGoogle,
  FaApple,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import cinemaImage from "../../assets/cinema.jpg"; // Import ảnh nền

function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${cinemaImage})` }}
      ></div>

      {/* Register Form */}
      <div className="relative z-10 max-w-md p-8 bg-white/90 rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-center">
          Create an account
        </h2>
        <p className="mb-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-500 underline">
            Log in
          </Link>
        </p>

        <form>
          {/* Profile Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              What should we call you?
            </label>
            <input
              type="text"
              placeholder="Enter your profile name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              What's your email?
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Create a password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <small className="block mt-1 text-xs text-gray-500">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </small>
          </div>

          {/* Terms */}
          <p className="mb-4 text-xs text-gray-500">
            By creating an account, you agree to the{" "}
            <Link to="#" className="font-semibold text-blue-500 underline">
              Terms of use
            </Link>{" "}
            and{" "}
            <Link to="#" className="font-semibold text-blue-500 underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Create an account
          </button>
        </form>

        {/* OR Section */}
        <p className="my-6 text-sm text-center text-gray-500">
          OR Continue with
        </p>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
            <FaFacebook /> Facebook
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
            <FaGoogle /> Google
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
            <FaApple /> Apple
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
