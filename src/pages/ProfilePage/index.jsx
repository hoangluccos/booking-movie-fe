import React, { useEffect, useState } from "react";
import "./ProfilePage.scss";
import ProfileImage from "../../assets/profile.png";
import instance from "../../api/instance";

const ProfilePage = () => {
  const [userData, setuserData] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("users/bio");
        console.log(res);
        setuserData(res.data.result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div className="content mt-3 mb-3">
      <div className="profile-page ">
        <div className="sidebar rounded">
          <div className="avatar">
            <img src={ProfileImage} alt="avatar" />
          </div>
          <div className="username">{userData.username}</div>
          <button className="logout btn btn-danger mt-3">Đăng xuất</button>
        </div>
        <div className="info-section rounded">
          <h2 className="fw-bold">Thông tin cá nhân</h2>
          <div className="">
            <div className="info-grid">
              <div className="info-item">
                <label>FirstName</label>
                <input type="text" value={userData.firstName} />
              </div>
              <div className="info-item">
                <label>Date of birth</label>
                <input type="text" disabled value="01/01/1990" />
              </div>
              <div className="info-item">
                <label>LastName</label>
                <input type="text" value={userData.lastName} />
              </div>
              <div className="info-item">
                <label>Email</label>
                <input type="text" value={userData.email} />
              </div>
            </div>
            <button className="btn btn-success mt-4">Lưu thông tin</button>
          </div>
        </div>
      </div>
      <div className="change-pw mt-4">
        <div className="info-section rounded">
          <h2 className="fw-bold">Đổi mật khẩu</h2>
          <div className="">
            <div className="info-grid">
              <div className="info-item">
                <label>Mật khẩu cũ</label>
                <input type="text" disabled value="user123" />
              </div>
              <div className="info-item">
                <label>Mật khẩu cũ</label>
                <input type="text" disabled value="01/01/1990" />
              </div>
              <div className="info-item">
                <label>Xác nhận lại mật khẩu cũ</label>
                <input type="text" disabled value="01/01/1990" />
              </div>
            </div>
            <button className="btn btn-success mt-4">Lưu thông tin</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
