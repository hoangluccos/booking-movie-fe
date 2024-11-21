import React, { useEffect, useState } from "react";
import instance from "../../../api/instance";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomeAdmin() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    (async () => {
      const res = await instance.get("/movies/");
      console.log(res);
      setMovies(res.data.result);
    })();
  }, []);

  // Tính toán các phim của trang hiện tại
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Xử lý chuyển trang
  const handleNextPage = () => {
    if (currentPage < Math.ceil(movies.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDeleteMovie = (idMovie) => {
    const deleteMovie = async () => {
      try {
        const res = await instance.delete(`/movies/${idMovie}`);
        console.log(res.data);

        if (res.status === 200) {
          // Cập nhật danh sách phim sau khi xóa
          toast.success("Delete Movie Successfully");
          setMovies((prevMovies) =>
            prevMovies.filter((movie) => movie.id !== idMovie)
          );
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    };
    deleteMovie();
  };

  return (
    <div className="home-admin p-4">
      <ToastContainer />
      <Link
        to="/admin/add-movie"
        className="p-2  bg-blue-600 text-white rounded-md mb-3"
      >
        Add Movie
      </Link>
      <div className="overflow-x-auto max-w-full mt-3">
        <table className="table-auto w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300">ID</th>
              <th className="p-2 border border-gray-300">Name</th>
              <th className="p-2 border border-gray-300">Premiere</th>
              <th className="p-2 border border-gray-300">Image</th>
              <th className="p-2 border border-gray-300">Genres</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMovies.map((movie, index) => (
              <tr key={movie.id}>
                <td className="p-2 border border-gray-300">
                  {indexOfFirstMovie + index + 1}
                </td>
                <td className="p-2 border border-gray-300 font-bold">
                  {movie.name}
                </td>
                <td className="p-2 border border-gray-300">{movie.premiere}</td>
                <td className="p-2 border border-gray-300">
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="w-full h-24 object-contain"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  {movie.genres.map((genre) => (
                    <p className="font-bold uppercase" key={genre.id}>
                      {genre.name}
                    </p>
                  ))}
                </td>
                <td className="p-2 border border-gray-300">
                  <Link
                    to={`/admin/edit-movie/${movie.id}`}
                    className="bg-yellow-400 text-white px-2 py-1 rounded m-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded m-1"
                  >
                    Delete
                  </button>
                  <hr />
                  <Link
                    to={`/admin/showtime/${movie.id}`}
                    className="bg-blue-400 text-white px-2 py-1 rounded m-1"
                  >
                    Show times
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-300"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(movies.length / itemsPerPage)}
        </span>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-300"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(movies.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomeAdmin;
