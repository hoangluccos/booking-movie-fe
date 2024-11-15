import React, { useEffect, useState } from "react";
import MovieItem from "../../components/MovieItem";
import instance from "../../api/instance";
import "./HomeUser.scss";
import { Link } from "react-router-dom";

function HomeUser({ isLogout }) {
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("/movies/");
        setData(res.data.result);
      } catch (error) {
        console.log("Failed to fetch movies:", error);
      }
    })();
  }, []);

  // Hiển thị tối đa 4 sản phẩm nếu `showAll` là `false`
  const displayedData = showAll ? data : data.slice(0, 4);

  return (
    <div className="contain">
      <div className="content gradient-background mt-4">
        <h1 className="text-center">PHIM ĐANG CHIẾU</h1>
        <div className="product-list">
          {displayedData.map((product, index) => (
            <Link to={`/movies/${product.id}`} key={index}>
              <MovieItem
                // key={index}
                image={product.image}
                title={product.name}
                subtitle={product.language}
                duration={product.duration}
              />
            </Link>
          ))}
          <div className="button-container">
            {!showAll && data.length > 4 ? (
              <button
                className="toggle-button"
                onClick={() => setShowAll(true)}
              >
                Hiển thị thêm
              </button>
            ) : (
              showAll && (
                <button
                  className="toggle-button"
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
  );
}

export default HomeUser;
