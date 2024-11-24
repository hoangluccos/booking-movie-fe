import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import instance from "../../api/instance";
import TicketModal from "../../components/TicketModal";
import CouponsPage from "../../pages/CouponsPage";
import CouponItem from "../../components/CouponItem";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function MovieDetail() {
  const img =
    "https://bhdstar.vn/wp-content/uploads/2024/10/poster-labubu-web-1.jpg";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoMovie, setInfoMovie] = useState({});
  const param = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(`/movies/${param.id}`);
        console.log(res.data.result);
        setInfoMovie(res.data.result);
      } catch (error) {
        console.log(error);
      }
    })();

    // Mở modal nếu query parameter "buyTicket" tồn tại
    if (query.get("buyTicket") === "true") {
      setIsModalOpen(true);
    }
  }, [param.id, query]);
  const closeModal = () => {
    setIsModalOpen(false);

    // Cập nhật URL để xóa query parameter "buyTicket"
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("buyTicket");
    navigate(`${currentUrl.pathname}${currentUrl.search}`, { replace: true });
  };
  return (
    <div className="mt-5 ">
      <div className="content mt-6 pb-3 flex flex-row gap-[40px] ">
        <div className="w-[480px] h-[500px]">
          <img src={infoMovie.image} alt="" className="w-full" />
        </div>
        <div className="">
          <h3 className="fw-bold">
            {infoMovie.name ? infoMovie.name.toUpperCase() : ""}
          </h3>
          <div className="flex align-items-center mt-5">
            <i className="fa-solid fa-star"></i>
            <p className="mx-3 mb-0 ">{infoMovie.rate}</p>
          </div>
          <div className="flex items-center mt-5">
            <i className="fa-solid fa-clock"></i>
            <p className="mx-3 mb-0 ">{infoMovie.duration} phút</p>
          </div>
          <div className="flex items-center mt-5">
            <i className="fa-solid fa-tag"></i>
            <p className="mx-3 mb-0">{infoMovie.language}</p>
          </div>
          <div className="mh-25 mt-5">
            <h4 className="fw-bold">NỘI DUNG</h4>
            <p>{infoMovie.content}</p>
          </div>
          <div className="mh-25 mt-5">
            <h4 className="fw-bold">KHỞI CHIẾU</h4>
            <p>{infoMovie.premiere}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-slate-300 text-black w-[98px] h-[36px] rounded-[6px] select-none transition-all duration-400 ease-in-out hover:bg-gradient-to-r hover:from-[#d56868] hover:to-[#f8cf55] hover:bg-[length:200%_100%] hover:bg-right"
          >
            <i className="fa-solid fa-ticket"></i> Mua vé
          </button>
          <TicketModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
      </div>
      <div className="content">
        <h3 className="fw-bold text-center ">ƯU ĐÃI HIỆN CÓ</h3>
        <div className="flex flex-wrap gap-[10px]">
          <CouponItem
            img={img}
            title="Cơ hội sở hữu LABUBU FLIP WITH ME 40cm tại HL-Theaters !"
            detail="Đến 3HL Movies mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
          ></CouponItem>
          <CouponItem
            img="https://bhdstar.vn/wp-content/uploads/2024/11/466793530_1003149731851513_661564586689858699_n.jpg"
            title="Siêu bão miễn phí vé"
            detail="Đến 3HL Movies mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
          ></CouponItem>
          <CouponItem
            img="https://bhdstar.vn/wp-content/uploads/2024/11/bap-free-vui-het-y.jpg"
            title="Bắp Free tại HL-Theaters !"
            detail="Tặng ngay bắp miễn phí KHÔNG phụ thu đổi vị dành cho 2 người khi xem phim."
          ></CouponItem>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
