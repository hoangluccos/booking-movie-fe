import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import instance from "../../api/instance";
import imgUserTmp from "../../assets/profile.png";
const PersonPage = () => {
  const location = useLocation();
  const personId = location.pathname.split("/")[2];
  const [personInfo, setPersonInfo] = useState({});
  const [listMovieByPersonId, setListMovieByPersonId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get(`/movies/person?personId=${personId}`);
        // console.log("res", res.data.result);
        setPersonInfo(res.data.result);
        setListMovieByPersonId(res.data.result.listMovies);
      } catch (error) {
        console.log("error when fetch api", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex pt-[50px] min-h-screen bg-gray-900 text-white">
      {/* Left Section - Actor Info */}
      <div className="w-1/4 p-6 flex flex-col items-center border-r border-gray-700">
        <img
          src={personInfo.image ? personInfo.image : imgUserTmp}
          alt={personInfo?.name}
          className="w-32 h-32 rounded-full mb-4 object-cover"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = imgUserTmp;
          }}
        />
        <h2 className="text-xl font-bold">{personInfo?.name}</h2>
        <div className="mt-4 text-sm text-gray-400">
          <p>Vai trò: {personInfo?.job?.name}</p>
          <p>Giới thiệu: Đang cập nhật</p>
          <p>Giới tính: {personInfo?.gender ? "Nam" : "Nữ"}</p>
          <p>DOB: {personInfo?.dateOfBirth}</p>
        </div>
      </div>

      {/* Right Section - Movie List */}
      <div className="w-3/4 p-6">
        <h3 className="text-2xl font-semibold mb-4">Các phim đã tham gia</h3>
        <div className="grid grid-cols-4 gap-4">
          {listMovieByPersonId.map((movie, index) => (
            <Link
              key={index}
              to={`/movies/${movie?.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <img
                src={movie?.image}
                alt={movie?.name}
                className="w-full h-[340px] object-cover"
              />
              <div className="p-2 text-center">
                <h4 className="text-md font-medium">{movie?.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
