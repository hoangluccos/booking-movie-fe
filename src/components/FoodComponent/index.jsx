import React from "react";

function FoodComponent({ price, name, image, selectHandle, isSelect }) {
  return (
    <button
      onClick={selectHandle}
      className={
        isSelect
          ? "border-2 border-black scale-110 ease-in-out w-[200px] h-[240px] flex-col rounded-sm"
          : "border w-[200px] h-[240px] flex-col rounded-sm"
      }
    >
      <div className="bg-red-500 w-full h-[70%] rounded-sm">
        <img src={image} alt="" className="object-cover w-full h-full" />
      </div>
      <h2 className="px-4 my-2">{name}</h2>
      <hr className="mx-3" />
      <div
        className={
          isSelect
            ? "bg-black text-white flex justify-between px-2 py-1"
            : "flex justify-between px-2 py-1"
        }
      >
        <h3>Giá online</h3>
        <h3>{price}</h3>
      </div>
    </button>
  );
}

export default FoodComponent;
