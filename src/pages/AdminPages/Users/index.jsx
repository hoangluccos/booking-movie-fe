import React, { useEffect, useState } from "react";
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

  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

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

      <div className="overflow-x-auto max-w-full">
        <table className="table-auto w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300">ID</th>
              <th className="p-2 border border-gray-300">Username</th>
              <th className="p-2 border border-gray-300">Last Name</th>
              <th className="p-2 border border-gray-300">Date of Birth</th>
              <th className="p-2 border border-gray-300">Avatar</th>
              <th className="p-2 border border-gray-300">Roles</th>
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
                  {movie.username}
                </td>
                <td className="p-2 border border-gray-300">{movie.lastName}</td>
                <td className="p-2 border border-gray-300">
                  {movie.dateOfBirth}
                </td>
                <td className="p-2 border border-gray-300 flex justify-center">
                  {movie.avatar ? (
                    <img
                      src={movie.avatar}
                      alt={movie.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={ProfileImage}
                      alt={movie.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                </td>
                <td className="p-2 border border-gray-300">
                  {movie.roles.map((role, index) => (
                    <p className="font-bold uppercase" key={index}>
                      {role.name}
                    </p>
                  ))}
                </td>
                <td className="p-2 border border-gray-300">
                  <button className="bg-yellow-400 text-white px-3 py-1 rounded m-1">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded m-1">
                    Delete
                  </button>
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

export default Users;
