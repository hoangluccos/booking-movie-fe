import { Select } from "antd";
import React from "react";
import TopMovie from "../TopMovie/TopMovie.tsx";

function Top3Movie(props) {
  const changeSelect = (value: string) => {
    console.log("selected", value);
  };
  return (
    <div className="">
      <div className="flex gap-2 items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Top 3 Movie</h2>
        <Select
          defaultValue="Today"
          style={{ width: 120 }}
          onChange={changeSelect}
          options={[
            { value: "today", label: "Today" },
            { value: "lastWeek", label: "Last Week" },
            { value: "lastMonth", label: "Last Month" },
          ]}
        />
      </div>
      <div className="flex gap-2">
        <TopMovie />
        <TopMovie />
        <TopMovie />
      </div>
    </div>
  );
}

export default Top3Movie;
