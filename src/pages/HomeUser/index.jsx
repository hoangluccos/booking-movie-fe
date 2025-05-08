import React, { useEffect, useState } from "react";
import MovieItem from "../../components/MovieItem";
import instance from "../../api/instance";
import { Link } from "react-router-dom";
import { transferStringToDateCheckToDay } from "../../utils/common";
import LabelText from "../../components/LabelText";

function HomeUser() {
  // const [data, setData] = useState([]);
  // const [showAll, setShowAll] = useState(false);
  const [showAllPlaying, setShowAllPlaying] = useState(false);
  const [showAllComingSoon, setShowAllComingSoon] = useState(false);
  const [listMoviePlaying, setListMoviePlaying] = useState([]);
  const [listMovieComingSoon, setListMovieComingSoon] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("/movies/");
        console.log("List Movies in HomeUser: ", res.data.result);
        // setData(res.data.result);
        setListMoviePlaying(
          res.data.result.filter(
            (product) => !transferStringToDateCheckToDay(product.premiere)
          )
        );
        setListMovieComingSoon(
          res.data.result.filter((product) =>
            transferStringToDateCheckToDay(product.premiere)
          )
        );
      } catch (error) {
        console.log("Failed to fetch movies:", error);
      }
    })();
  }, []);

  // Hiển thị tối đa 4 sản phẩm nếu `showAll` là `false`
  // const displayedData = showAll ? data : data.slice(0, 4);
  const displayedDataPlaying = showAllPlaying
    ? listMoviePlaying
    : listMoviePlaying.slice(0, 4);
  const displayedDataComingSoon = showAllComingSoon
    ? listMovieComingSoon
    : listMovieComingSoon.slice(0, 4);
  return (
    <div className="mt-[26px]">
      <div className="bg-[0f172a] w-full">
        <div className="content user-select-none text-white">
          <div className="bg-gradient-to-r from-[#4b3f72] to-[#1a1a1a] mt-4 py-4">
            <div className="max-w-screen-xl mx-auto px-4">
              <LabelText text={"PHIM ĐANG CHIẾU"} />
              <hr className="border-t-2 border-gray-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 justify-start">
                {displayedDataPlaying
                  .filter(
                    (product) =>
                      !transferStringToDateCheckToDay(product.premiere)
                  )
                  .map((product, index) => (
                    <Link to={`/movies/${product.id}`} key={index}>
                      <MovieItem
                        image={product.image}
                        title={product.name}
                        subtitle={product.language}
                        duration={product.duration}
                        id={product.id}
                      />
                    </Link>
                  ))}
              </div>
              <div className="w-full flex justify-center">
                {!showAllPlaying && listMoviePlaying.length > 4 ? (
                  <button
                    className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                    onClick={() => setShowAllPlaying(true)}
                  >
                    Hiển thị thêm
                  </button>
                ) : (
                  showAllPlaying && (
                    <button
                      className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                      onClick={() => setShowAllPlaying(false)}
                    >
                      Ẩn bớt
                    </button>
                  )
                )}
              </div>
            </div>
            {/* COMING SOON */}
            <div className="max-w-screen-xl mx-auto px-4 mt-2">
              <LabelText text={"PHIM SẮP CHIẾU"} />

              <hr className="border-t-2 border-gray-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 justify-start">
                {displayedDataComingSoon
                  .filter((product) =>
                    transferStringToDateCheckToDay(product.premiere)
                  )
                  .map((product, index) => (
                    <Link to={`/movies/${product.id}`} key={index}>
                      <MovieItem
                        image={product.image}
                        title={product.name}
                        subtitle={product.language}
                        duration={product.duration}
                        id={product.id}
                      />
                    </Link>
                  ))}
              </div>
              <div className="w-full flex justify-center mt-4">
                {!showAllComingSoon && listMovieComingSoon.length > 4 ? (
                  <button
                    className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                    onClick={() => setShowAllComingSoon(true)}
                  >
                    Hiển thị thêm
                  </button>
                ) : (
                  showAllComingSoon && (
                    <button
                      className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                      onClick={() => setShowAllComingSoon(false)}
                    >
                      Ẩn bớt
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeUser;
