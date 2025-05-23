import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MovieItem from "../../components/MovieItem";

function SearchPage() {
  const location = useLocation();
  const listMovies = location.state?.listMovies || [];
  const [showAll, setShowAll] = useState(false);
  // Hiển thị tối đa 4 sản phẩm nếu `showAll` là `false`
  const displayedData = showAll ? listMovies : listMovies.slice(0, 4);
  return (
    <div className="mt-[26px]">
      <div className="bg-[0f172a] w-full">
        <div className="content user-select-none text-white">
          <div className="bg-gradient-to-r from-[#4b3f72] to-[#1a1a1a] mt-4 py-4">
            <div className="max-w-screen-xl mx-auto px-4">
              <h1 className="text-center text-2xl font-semibold mb-4">
                Kết quả tìm kiếm
              </h1>
              <hr className="border-t-2 border-gray-200 my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 justify-start">
                {displayedData.map((product, index) => (
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
                {!showAll && listMovies.length > 4 ? (
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

export default SearchPage;
