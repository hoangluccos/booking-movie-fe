import React from "react";

function LabelText({ text }) {
  return (
    <div className="flex justify-center">
      <p className="inline-block text-center text-2xl text-[#0F172A] font-bold px-3 py-1 border border-gray-600 rounded-md bg-white">
        {text}
      </p>
    </div>
  );
}

export default LabelText;
