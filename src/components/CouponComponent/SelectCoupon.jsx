import React from "react";

function SelectCoupon({ image, name, isSelect, handleSelect }) {
  return (
    <button
      onClick={handleSelect}
      className={
        isSelect
          ? "bg-black text-white flex bg-blue w-full h-[40px] items-center gap-x-3 my-1 rounded-sm"
          : "border flex bg-blue w-full h-[40px] items-center gap-x-3 my-1 rounded-sm"
      }
    >
      <img src={image} alt="" className="h-full max-w-[60px] object-cover" />

      <h3>{name}</h3>
    </button>
  );
}

export default SelectCoupon;
