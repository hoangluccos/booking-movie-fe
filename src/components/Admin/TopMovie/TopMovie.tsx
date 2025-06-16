import React from "react";
interface TopMovieProp {
  image: string;
  name: string;
  amount: number;
}
function TopMovie({ image, name, amount }: TopMovieProp) {
  return (
    <div className="flex w-1/3 h-[200px] items-center justify-center gap-2">
      <div className="w-1/2 h-full">
        <img
          className="w-full h-full object-cover rounded-[10px]"
          src={image}
          alt=""
        />
      </div>
      <div className="w-1/2">
        <p className="text-yellow-400 text-xl font-bold">{name}</p>
        <p className="text-green-600 font-bold">{amount.toLocaleString()}VND</p>
      </div>
    </div>
  );
}

export default TopMovie;
