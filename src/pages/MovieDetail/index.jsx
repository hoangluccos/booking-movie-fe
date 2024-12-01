import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import instance from "../../api/instance";
import TicketModal from "../../components/TicketModal";
import CouponItem from "../../components/CouponItem";
import FeedbackItem from "../../components/FeedbackItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function useQuery() {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
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
  const [feedback, setFeedback] = useState([
    {
      avatar:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
      username: "hoangluc",
      rate: "9.5",
      content: "dang xem",
    },
  ]);
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(0);

  const handleSubmit = () => {
    if (!comment.trim() || rate === 0) {
      toast.error("Vui lòng nhập đánh giá và chọn số sao!");
      return;
    }

    const newFeedback = {
      content: comment,
      rate: rate,
      movieId: param.id,
    };
    try {
      const res = instance.post("/feedbacks/", newFeedback);
      console.log(res.data);
      toast.success("Đã gửi feedback, đợi phản hồi từ admin");
      setComment("");
      setRate(0);
    } catch (error) {
      console.log("Error feedback:", error);
    }
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await instance.get(`/feedbacks/${param.id}/all`);
        console.log(res.data);
        if (res.data.result.length > 0) {
          setFeedback(res.data.result);
        } else {
          setFeedback([]);
        }
      } catch (error) {
        console.log("Error fetch feedback: ", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await instance.get(`/movies/${param.id}`);
        console.log(res.data.result);
        setInfoMovie(res.data.result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovieDetails();

    if (query.get("buyTicket") === "true") {
      setIsModalOpen(true);
    }
  }, [param.id, query]);

  const closeModal = () => {
    setIsModalOpen(false);
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("buyTicket")) {
      currentUrl.searchParams.delete("buyTicket");
      navigate(`${currentUrl.pathname}${currentUrl.search}`, { replace: true });
    }
  };

  return (
    <div className="mt-5">
      <ToastContainer />
      <div className="content movie-detail mt-6 pb-3 flex flex-row gap-[40px]">
        <div className="w-[40%] h-[40%] movie-banner">
          <img src={infoMovie.image} alt="" className="w-full" />
        </div>
        <div>
          <h3 className="fw-bold">
            {infoMovie.name ? infoMovie.name.toUpperCase() : ""}
          </h3>
          <div className="flex align-items-center mt-5">
            <i className="fa-solid fa-star"></i>
            <p className="mx-3 mb-0">{infoMovie.rate}</p>
          </div>
          <div className="flex items-center mt-5">
            <i className="fa-solid fa-clock"></i>
            <p className="mx-3 mb-0">{infoMovie.duration} phút</p>
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
      <div className="content coupons">
        <h3 className="fw-bold text-center">ƯU ĐÃI HIỆN CÓ</h3>
        <div className="flex flex-wrap gap-[10px] justify-center">
          <CouponItem
            img={img}
            title="Cơ hội sở hữu LABUBU FLIP WITH ME 40cm tại HL-Theaters !"
            detail="Đến 3HL Movies mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
          />
          <CouponItem
            img="https://bhdstar.vn/wp-content/uploads/2024/11/466793530_1003149731851513_661564586689858699_n.jpg"
            title="Siêu bão miễn phí vé"
            detail="Đến 3HL Movies mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
          />
          <CouponItem
            img="https://bhdstar.vn/wp-content/uploads/2024/11/bap-free-vui-het-y.jpg"
            title="Bắp Free tại HL-Theaters !"
            detail="Tặng ngay bắp miễn phí KHÔNG phụ thu đổi vị dành cho 2 người khi xem phim."
          />
        </div>
      </div>

      <div className="content feedback">
        <hr className="border-t-2 border-gray-200 my-4" />
        <h2 className="font-bold mb-3 text-[24px]">ĐÁNH GIÁ PHIM</h2>
        {infoMovie.canComment ? (
          <div className="">
            <p>Hãy để lại nhận xét của bạn về phim này</p>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-solid fa-star cursor-pointer ${
                    rate >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRate(star)}
                ></i>
              ))}
            </div>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              className="border rounded w-full bg-gray-100 p-2"
            ></textarea>
            <div className="flex justify-end">
              {" "}
              <button
                onClick={handleSubmit}
                className="bg-slate-600 rounded p-1 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {feedback.length === 0 ? (
          <div className="">
            <hr className="border-t-2 border-gray-200 my-4" />
            <p>Chưa có đánh giá </p>
          </div>
        ) : (
          feedback.map((item, index) => {
            return (
              <FeedbackItem
                key={index}
                avatar={item.avatar}
                username={item.byName}
                rate={item.rate}
                content={item.content}
                date={item.date}
                time={item.time}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
