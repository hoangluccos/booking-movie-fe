import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import instance from "../../api/instance";

const GenreMoviePage = () => {
  const location = useLocation();
  const genreId = location.pathname.split("/")[2];
  const [genreInfo, setGenreInfo] = useState({});
  const [listMovieByGenreId, setListMovieByGenreId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get(`/movies/genre?genreId=${genreId}`);
        console.log("res", res.data.result);
        setGenreInfo(res.data.result);
        setListMovieByGenreId(res.data.result.listMovies);
      } catch (error) {
        console.log("error when fetch api", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-col pt-[40px] px-[100px] min-h-screen bg-gray-900 text-white">
      <div className="content">
        <div className="">
          <p className="text-2xl">Phim {genreInfo?.name}</p>
          <hr className="text-gray-50 font-semibold" />
        </div>
        {/* Below Section - Movie List */}
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-4">Các phim đã tham gia</h3>

          <div className="grid grid-cols-4 gap-4">
            {listMovieByGenreId.map((movie, index) => (
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
    </div>
  );
};

export default GenreMoviePage;
