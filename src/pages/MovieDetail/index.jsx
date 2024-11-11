import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../api/instance";
import "./MovieDetail.scss";
function MovieDetail() {
  const [infoMovie, setInfoMovie] = useState({});
  const param = useParams();
  // console.log(param.id);
  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(`/movies/${param.id}`);
        console.log(res);
        setInfoMovie(res.data.result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [param.id]);
  return (
    <div>
      <div className="content mt-3 pb-3 detail-movie d-flex flex-direction-row gap-4">
        <div className="img-banner">
          <img src={infoMovie.image} alt="" />
        </div>
        <div className="info-movie">
          <h3 className="fw-bold">
            {infoMovie.name ? infoMovie.name.toUpperCase() : ""}
          </h3>
          <div className="d-flex align-items-center">
            <i class="fa-solid fa-star"></i>
            <p className="mx-3 mb-0 ">{infoMovie.rate}</p>
          </div>
          <div className="d-flex align-items-center mt-3">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div className="d-flex align-items-center mt-3">
            <i class="fa-solid fa-tag"></i>
          </div>
          <div className="describe mt-3 mh-25">
            <h4 className="fw-bold">MÔ TẢ</h4>
            <p>{infoMovie.content}</p>
          </div>
          <div className="movie-about mt-3 mh-25">
            <h4 className="fw-bold">NỘI DUNG</h4>
            <p>{infoMovie.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
