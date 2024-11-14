import React, { useEffect, useState } from "react";
import "./Users.scss";
import instance from "../../../api/instance";
import ProfileImage from "../../../assets/profile.png";

function Users() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    (async () => {
      const res = await instance.get("/users/");
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
      <h1>Admin</h1>
      <table className="table-bordered table-striped ml-3 w-100 text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>username</th>
            <th>lastName</th>
            <th>dateOfBirth</th>
            <th>avatar</th>
            <th>roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((movie, index) => (
            <tr key={movie.id}>
              <td>{indexOfFirstMovie + index + 1}</td>
              <td className="fw-bold">{movie.username}</td>
              <td>{movie.lastName}</td>
              <td>{movie.dateOfBirth}</td>
              <td className="image-column">
                {movie.avatar ? (
                  <img
                    src={movie.avatar}
                    alt={movie.name}
                    className="movie-image"
                  />
                ) : (
                  <img
                    src={ProfileImage}
                    alt={movie.name}
                    className="movie-image"
                  />
                )}
              </td>
              <td>
                {movie.roles.map((role, index) => (
                  <p className="fw-bold" key={index}>
                    {role.name.toUpperCase()}
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

export default Users;
