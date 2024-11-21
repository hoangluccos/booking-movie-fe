import React from "react";
import { Link } from "react-router-dom";

function MovieItem({ image, title, subtitle, duration, id }) {
  return (
    <div className="relative group w-50 m-2 text-gray-300 hover:cursor-pointer hover:scale-105 transition-transform duration-300">
      <img src={image} alt={title} className="w-full h-auto rounded-lg" />
      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center rounded-lg">
        <Link
          to={`/movies/${id}?buyTicket=true`}
          className="mb-2 w-32 px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 text-center"
        >
          Mua vé
        </Link>
        <Link
          to={`/movies/${id}`}
          className="w-32 px-4 py-2 bg-white text-black rounded-md hover:bg-orange-100 text-center"
        >
          Xem chi tiết
        </Link>
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-normal m-0">{title}</h3>
        <p className="text-sm text-gray-400">Ngôn ngữ: {subtitle}</p>
        <p className="text-sm text-gray-400">Thời lượng: {duration}</p>
      </div>
    </div>
  );
}

export default MovieItem;
