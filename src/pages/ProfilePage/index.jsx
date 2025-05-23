import React, { useEffect, useState } from "react";
import ProfileImage from "../../assets/profile.png";
import instance from "../../api/instance";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ChangePassWord from "../../components/ChangePassWord";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(ProfileImage);
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleLogout = () => {
    (async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        await instance.post("/auth/logout", token);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Bạn đã logout");
        setTimeout(() => {
          nav("/login");
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const onSubmit = (data) => {
    console.log("raw data", data);
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString().split("T")[0]
        : null,
      avatar: null,
    };
    console.log("formattedData", formattedData);
    (async () => {
      try {
        const res = await instance.put("/users/bio", formattedData);
        toast.success("Bạn đã update thành công!");
        reset({ ...formattedData });
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleAvatarSave = async () => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append("file", avatar);
    try {
      const res = await instance.put("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      //hide toggle
      setAvatar(null);
    } catch (error) {
      toast.error("Tải lên Avatar thất bại!");
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("users/bio");
        const formattedData = {
          ...res.data.result,
          dateOfBirth: formatDate(res.data.result.dateOfBirth),
        };
        reset(formattedData);
        setUserData(formattedData);
        if (res.data.result.avatar) {
          setPreviewAvatar(res.data.result.avatar);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="my-4 flex-grow">
      <div className="content mx-auto my-4">
        {/* <ToastContainer /> */}
        <div className="flex profile-info">
          <div className="form-avatar bg-white border rounded p-5 text-center w-1/3">
            <div className="avatar">
              <img
                src={previewAvatar || ProfileImage}
                alt="avatar"
                className="w-24 h-24 rounded-full mx-auto mb-3 cursor-pointer object-cover"
                onClick={() => document.getElementById("avatarInput").click()}
              />
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            {avatar && (
              <button
                onClick={handleAvatarSave}
                className="bg-blue-500 text-white py-2 px-4 rounded-full mt-3"
              >
                Save
              </button>
            )}
            <div className="flex justify-center">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-full mt-3 block"
                onClick={() => handleLogout()}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <form
            className="form-input bg-white border rounded p-5 ml-5 flex-grow"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="font-bold mb-5">Thông tin cá nhân</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="info-item">
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.firstName && (
                  <span className="text-red-500">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="info-item">
                <label className="block mb-2">Date of birth</label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="info-item">
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.lastName && (
                  <span className="text-red-500">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
              <div className="info-item">
                <label className="block mb-2">Email</label>
                <input
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-500 text-white py-2 px-6 rounded-full"
            >
              Lưu thông tin
            </button>
          </form>
        </div>
        <div className="mt-4">
          <ChangePassWord userData={userData} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
