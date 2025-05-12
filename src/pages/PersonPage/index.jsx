import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../../api/instance";

const PersonPage = () => {
  const actor = {
    name: "Kim Hye-ja",
    image:
      "https://res.cloudinary.com/ddwbopzwt/image/upload/v1746410724/Victor%20V%C5%A9/xxoc0ojefllmiytj1llc.jpg",
    genre: "Điện ảnh",
    intro: "Diễn viên nổi tiếng",
    birthDate: "Ngày sinh: Đang cập nhật",
    movies: [
      {
        title: "Heavenly Ever After",
        image: "https://via.placeholder.com/200",
        pd: "PD: 7",
        tm: "TM: 6",
      },
      {
        title: "Our Blues",
        image: "https://via.placeholder.com/200",
        pd: "PD: 20",
        tm: "TM: 20",
      },
      {
        title: "The Light in Your Eyes",
        image: "https://via.placeholder.com/200",
        pd: "PD: 12",
      },
      {
        title: "How to Steal a Dog",
        image: "https://via.placeholder.com/200",
        pd: "PD: T.Minh",
      },
      {
        title: "How to Steal a Dog",
        image: "https://via.placeholder.com/200",
        pd: "PD: T.Minh",
      },
    ],
  };
  const [listMovieByPersonId, setListMovieByPersonId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get("/movies/");
        console.log("res", res.data.result);
        setListMovieByPersonId(res.data.result);
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
          src={actor.image}
          alt={actor.name}
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-xl font-bold">{actor.name}</h2>
        <div className="mt-4 text-sm text-gray-400">
          <p>Thể loại: Đang cập nhật</p>
          <p>Giới thiệu: Đang cập nhật</p>
          <p>Giới tính: Đang cập nhật</p>
          <p>{actor.birthDate}</p>
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
