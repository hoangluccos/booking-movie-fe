import React, { useEffect, useState } from "react";
import CouponItem from "../../components/CouponItem";
import instance from "../../api/instance";

function TheatersPage() {
  const [theaters, setTheaters] = useState([]);
  const img =
    "https://lh3.googleusercontent.com/p/AF1QipPFD5rcTPXnFkTC-mP1_fXRg0T-c8Ez51xpwnJy=s1360-w1360-h1020";
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
      <div className="flex flex-wrap gap-[10px]">
        {theaters.map((theater) => {
          return (
            <CouponItem
              key={theater.id}
              img={img}
              title={theater.name}
              detail={theater.location}
            ></CouponItem>
          );
        })}
      </div>
    </div>
  );
}

export default TheatersPage;
