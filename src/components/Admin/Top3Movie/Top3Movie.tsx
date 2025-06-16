import { Select } from "antd";
import { useEffect, useState } from "react";
import TopMovie from "../TopMovie/TopMovie.tsx";
import instance from "../../../api/instance.js";
import Item from "antd/es/list/Item";
import { MovieDetailType } from "../../../pages/AdminPages/Data/Data.tsx";

function Top3Movie() {
  const [valueSearchTopMovie, setValueSearchTopMovie] = useState<
    "today" | "lastWeek" | "lastMonth"
  >("lastMonth");
  const [listTopMovies, setListTopMovie] = useState<
    { amount: number; movie: MovieDetailType }[]
  >([]);
  console.log("valueSearchTopMovie", valueSearchTopMovie);
  const changeSelect = (value: string) => {
    console.log("selected", value);
    setValueSearchTopMovie(value as "today" | "lastWeek" | "lastMonth");
  };
  const fetchApi = async (type: string) => {
    try {
      const res = await instance.post(`/revenues/${type}`);
      console.log("res api revenues", res.data);
      setListTopMovie(res.data.result);
    } catch (error) {
      console.log("Error fetch api");
    }
  };
  useEffect(() => {
    switch (valueSearchTopMovie) {
      case "today":
        //fetchapi
        fetchApi("byDate");
        break;
      case "lastWeek":
        //fetchapi
        fetchApi("byWeek");
        break;
      default:
        //fetchapi
        fetchApi("byMonth");
    }
  }, [valueSearchTopMovie]);
  return (
    <div className="">
      <div className="flex gap-2 items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Top 3 Movie</h2>
        <Select
          defaultValue="Last Month"
          style={{ width: 120 }}
          onChange={changeSelect}
          options={[
            { value: "today", label: "Today" },
            { value: "lastWeek", label: "Last Week" },
            { value: "lastMonth", label: "Last Month" },
          ]}
        />
      </div>
      <div className="flex gap-2 w-full">
        {listTopMovies.length > 0 ? (
          listTopMovies.map((item, i) => (
            <TopMovie
              amount={item.amount}
              name={item.movie.name}
              image={item.movie.image}
            />
          ))
        ) : (
          <p className="h-10 text-center text-xl text-white">
            Dont have enough data
          </p>
        )}
      </div>
    </div>
  );
}

export default Top3Movie;
