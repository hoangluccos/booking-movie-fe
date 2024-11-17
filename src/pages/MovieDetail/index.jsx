import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../api/instance";
import TicketModal from "../../components/TicketModal";
function MovieDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="mt-5 ">
      <div className="content mt-6 pb-3 flex flex-row gap-[40px] ">
        <div className="w-[480px] h-[720px]">
          <img src={infoMovie.image} alt="" className="w-full" />
        </div>
        <div className="">
          <h3 className="fw-bold">
            {infoMovie.name ? infoMovie.name.toUpperCase() : ""}
          </h3>
          <div className="flex align-items-center mt-5">
            <i class="fa-solid fa-star"></i>
            <p className="mx-3 mb-0 ">{infoMovie.rate}</p>
          </div>
          <div className="flex items-center mt-5">
            <i class="fa-solid fa-clock"></i>
            <p className="mx-3 mb-0 ">{infoMovie.duration} phút</p>
          </div>
          <div className="flex items-center mt-5">
            <i class="fa-solid fa-tag"></i>
          </div>
          <div className=" mt-5 mh-25">
            <h4 className="fw-bold">MÔ TẢ</h4>
            <p>{infoMovie.content}</p>
          </div>
          <div className="mh-25 mt-5">
            <h4 className="fw-bold">NỘI DUNG</h4>
            <p>{infoMovie.content}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-slate-300 text-black w-[98px] h-[36px] rounded-[6px] select-none transition-all duration-400 ease-in-out hover:bg-gradient-to-r hover:from-[#d56868] hover:to-[#f8cf55] hover:bg-[length:200%_100%] hover:bg-right"
          >
            <i class="fa-solid fa-ticket"></i> Mua vé
          </button>
          <TicketModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
