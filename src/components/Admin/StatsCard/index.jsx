import React from "react";

function StatsCard({ title, value, color }) {
  return (
    <div className={`p-4 shadow rounded ${color}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl">{value}</p>
    </div>
  );
}

export default StatsCard;
