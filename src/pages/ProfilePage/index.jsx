import React, { useEffect, useState } from "react";
import "./ProfilePage.scss";
import ProfileImage from "../../assets/profile.png";
import instance from "../../api/instance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../utils/validationSchema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import ChangePassWord from "../../components/ChangePassWord";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
      avatar: null,
    };

    console.log(formattedData);
    (async () => {
      const res = await instance.put("/users/bio", formattedData);
      console.log(res);
      toast.success("Bạn đã update thành công!");
      reset(formattedData);
    })();
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("users/bio");
        console.log(res);
        const formattedData = {
          ...res.data.result,
          dateOfBirth: formatDate(res.data.result.dateOfBirth),
        };
        reset(formattedData);
        setUserData(formattedData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="content mt-3 mb-3">
      <ToastContainer />
      <div className="profile-page ">
        <div className="sidebar rounded">
          <div className="avatar">
            <img src={ProfileImage} alt="avatar" />
          </div>
          <Link className="logout btn btn-danger mt-3">Đăng xuất</Link>
        </div>
        <form
          className="info-section rounded"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="fw-bold">Thông tin cá nhân</h2>
          <div className="">
            <div className="info-grid">
              <div className="info-item">
                <label>First Name</label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: true,
                  })}
                />
                {errors.firstName && (
                  <span className="text-danger">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="info-item">
                <label>Date of birth</label>
                <input type="date" {...register("dateOfBirth", {})} />
              </div>
              <div className="info-item">
                <label>Last Name</label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: true,
                  })}
                />
                {errors.lastName && (
                  <span className="text-danger">{errors.lastName.message}</span>
                )}
              </div>
              <div className="info-item">
                <label>Email</label>
                <input type="text" {...register("email")} />
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-4">
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
      <div className="change-pw mt-4">
        <ChangePassWord userData={userData}></ChangePassWord>
      </div>
    </div>
  );
};

export default ProfilePage;
