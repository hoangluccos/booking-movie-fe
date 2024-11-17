import React, { useEffect, useState } from "react";
import instance from "../../../api/instance";

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

  return (
    <div className="home-admin p-4">
      <h1 className="text-3xl font-bold mb-4">Admin</h1>

      {/* Wrapper thêm overflow-x-auto */}
      <div className="overflow-x-auto max-w-full">
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
                  <button className="bg-yellow-400 text-white px-2 py-1 rounded m-1">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded m-1">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Điều khiển phân trang */}
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
