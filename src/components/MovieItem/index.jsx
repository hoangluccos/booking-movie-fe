import React from "react";

function MovieItem({ image, title, subtitle, duration }) {
  return (
    <div className="w-48 m-2 text-gray-300 hover:cursor-pointer hover:scale-105 transition-transform duration-300">
      <img src={image} alt={title} className="w-full h-auto rounded-lg" />
      <div className="mt-2">
        <h3 className="text-lg font-normal m-0">{title}</h3>
        <p className="text-sm text-gray-400">Ngôn ngữ: {subtitle}</p>
        <p className="text-sm text-gray-400">Thời lượng: {duration}</p>
      </div>
    </div>
  );
}

export default MovieItem;
