import React, { useEffect, useState } from "react";
import instance from "../../api/instance";
// import { useNavigate } from "react-router-dom";
import img from "../../assets/cinema.jpg";
import TheaterItemBasic from "../../components/TheaterItemBasic";
function TheatersPage() {
  const [theaters, setTheaters] = useState([]);
  // const navigate = useNavigate();
  // const token = JSON.parse(localStorage.getItem("token"));
  // useEffect(() => {
  //   if (token === null) {
  //     navigate("/login");
  //   }
  // }, []);
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await instance.get("/theaters/");
        console.log(res.data.result);
        setTheaters(res.data.result);
      } catch (error) {
        console.log("error: " + error);
      }
    };
    fetchTheaters();
  }, []);
  return (
    <div className="content mt-4">
      <div className="theater-page flex flex-wrap gap-[10px]">
        {theaters.map((theater) => {
          return (
            <TheaterItemBasic
              key={theater.id}
              img={img}
              title={theater.name}
              detail={theater.location}
            ></TheaterItemBasic>
          );
        })}
      </div>
    </div>
  );
}

export default TheatersPage;
