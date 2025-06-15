import React from "react";
import ImageSample from "../../../assets/cinema.jpg";
interface TopMovieProp {
  image: string;
  name: string;
  revenue: number;
}
function TopMovie({ image, name, revenue }: TopMovieProp) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-1/2 h-full">
        <img
          className="w-full h-full object-cover rounded-[10px]"
          src={ImageSample}
          alt=""
        />
      </div>
      <div className="w-1/2">
        <p className="text-yellow-400 text-xl font-bold">Movie Name</p>
        <p className="text-green-600 font-bold">300.000.VND</p>
      </div>
    </div>
  );
}

export default TopMovie;
