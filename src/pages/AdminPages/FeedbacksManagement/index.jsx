import React, { useEffect, useState } from "react";
import instance from "../../../api/instance";

function FeedbacksManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [movies, setMovies] = useState({}); // Để lưu thông tin chi tiết của các phim

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await instance.get("/feedbacks/");
        if (response.data.code === 200) {
          setFeedbacks(response.data.result);
          fetchMoviesDetails(response.data.result); // Gọi API để lấy thông tin phim
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bình luận:", error);
      }
    };

    const fetchMoviesDetails = async (feedbacks) => {
      const movieIds = [
        ...new Set(feedbacks.map((feedback) => feedback.movieId)),
      ]; // Lấy tất cả các movieId duy nhất
      try {
        const movieDetails = {};
        for (const movieId of movieIds) {
          const response = await instance.get(`/movies/${movieId}`);
          console.log("Movie details:", response.data.result); // Log để kiểm tra dữ liệu phim
          if (response.data.result) {
            movieDetails[movieId] = response.data.result; // Lưu thông tin phim vào object
          }
        }
        setMovies(movieDetails); // Cập nhật state với thông tin phim
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phim:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await instance.put(`/feedbacks/toggle/${id}`);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === id
            ? { ...feedback, status: !feedback.status }
            : feedback
        )
      );
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái bình luận:", error);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await instance.delete(`/feedbacks/${id}`);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback.id !== id)
      );
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý bình luận</h2>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Người gửi</th>
            <th className="border px-4 py-2 max-w-[60px]">Nội dung</th>
            <th className="border px-4 py-2">Sao</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">Tên phim</th>
            <th className="border px-4 py-2">Ảnh</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td className="border px-4 py-2">{feedback.byName}</td>
              <td className="border px-4 py-2 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                {feedback.content}
              </td>

              <td className="border px-4 py-2">{feedback.rate}</td>
              <td className="border px-4 py-2">
                <span
                  className={
                    feedback.status ? "text-green-500" : "text-red-500"
                  }
                >
                  {feedback.status ? "Hiển thị" : "Ẩn"}
                </span>
              </td>
              <td className="border px-4 py-2">
                {movies[feedback.movieId] ? (
                  <div>
                    <strong>{movies[feedback.movieId].name}</strong>
                  </div>
                ) : (
                  <p>Đang tải thông tin...</p>
                )}
              </td>
              <td className="border px-4 py-2">
                {movies[feedback.movieId] ? (
                  <div>
                    <img
                      src={movies[feedback.movieId].image}
                      alt="Movie Poster"
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                ) : (
                  <p>Đang tải thông tin...</p>
                )}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => toggleStatus(feedback.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  {feedback.status ? "Ẩn" : "Hiển thị"}
                </button>
                <button
                  onClick={() => deleteFeedback(feedback.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbacksManagement;
