import React, { useEffect, useState } from "react";
import MovieItem from "../../components/MovieItem";
import instance from "../../api/instance";
import { Link } from "react-router-dom";
import { transferStringToDateCheckToDay } from "../../utils/common";
import LabelText from "../../components/LabelText";

function HomeUser() {
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("/movies/");
        console.log("List Movies in HomeUser: ", res.data.result);
        setData(res.data.result);
      } catch (error) {
        console.log("Failed to fetch movies:", error);
      }
    })();
  }, []);

  // Hiển thị tối đa 4 sản phẩm nếu `showAll` là `false`
  const displayedData = showAll ? data : data.slice(0, 4);

  return (
    <div className="mt-[26px]">
      <div className="bg-[0f172a] w-full">
        <div className="content user-select-none text-white">
          <div className="bg-gradient-to-r from-[#4b3f72] to-[#1a1a1a] mt-4 py-4">
            <div className="max-w-screen-xl mx-auto px-4">
              <LabelText text={"PHIM ĐANG CHIẾU"} />
              <hr className="border-t-2 border-gray-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 justify-start">
                {displayedData
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
                {!showAll && data.length > 4 ? (
                  <button
                    className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                    onClick={() => setShowAll(true)}
                  >
                    Hiển thị thêm
                  </button>
                ) : (
                  showAll && (
                    <button
                      className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                      onClick={() => setShowAll(false)}
                    >
                      Ẩn bớt
                    </button>
                  )
                )}
              </div>
            </div>
            {/* COMING SOON */}
            <div className="max-w-screen-xl mx-auto px-4">
              <LabelText text={"PHIM SẮP CHIẾU"} />

              <hr className="border-t-2 border-gray-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 justify-start">
                {displayedData
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
                {!showAll && data.length > 4 ? (
                  <button
                    className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                    onClick={() => setShowAll(true)}
                  >
                    Hiển thị thêm
                  </button>
                ) : (
                  showAll && (
                    <button
                      className="px-5 py-2 bg-[#4b3f72] text-white rounded-md transition-colors duration-300 hover:bg-[#6a579f]"
                      onClick={() => setShowAll(false)}
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
