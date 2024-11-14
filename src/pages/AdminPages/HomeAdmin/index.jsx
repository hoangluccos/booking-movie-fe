import React, { useEffect, useState } from "react";
import "./HomeAdmin.scss";
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

  // Calculate movies for the current page
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Handle page changes
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
    <div className="home-admin">
      <h1 className="m-3">Admin</h1>
      <table className="table-bordered table-striped ml-3 w-100 text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Premiere</th>
            <th>Image</th>
            <th>Genres</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((movie, index) => (
            <tr key={movie.id}>
              <td>{indexOfFirstMovie + index + 1}</td>
              <td className="fw-bold">{movie.name}</td>
              <td>{movie.premiere}</td>
              <td className="image-column">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="movie-image"
                />
              </td>
              <td>
                {movie.genres.map((genre) => (
                  <p className="fw-bold" key={genre.id}>
                    {genre.name.toUpperCase()}
                  </p>
                ))}
              </td>
              <td>
                <button className="btn btn-warning m-1">Edit</button>
                <button className="btn btn-danger m-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls text-center mt-3">
        <button
          className="btn btn-primary m-1"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(movies.length / itemsPerPage)}
        </span>
        <button
          className="btn btn-primary m-1"
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
