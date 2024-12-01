import React from "react";

function FeedbackItem({ username, content, rate, date, time }) {
  // const renderStars = (rate) => {
  //   const fullStars = Math.floor(rate);
  //   console.log(fullStars);
  //   const halfStar = rate - fullStars >= 0.5 ? 1 : 0;
  //   const emptyStars = 5 - fullStars - halfStar;

  //   const stars = [];

  //   for (let i = 0; i < fullStars; i++) {
  //     stars.push(
  //       <i key={`full-${i}`} className="fa-solid fa-star text-yellow-400"></i>
  //     );
  //   }

  //   if (halfStar) {
  //     stars.push(
  //       <i
  //         key="half"
  //         className="fa-solid fa-star-half-stroke text-yellow-400"
  //       ></i>
  //     );
  //   }

  //   for (let i = 0; i < emptyStars; i++) {
  //     stars.push(
  //       <i key={`empty-${i}`} className="fa-regular fa-star text-gray-300"></i>
  //     );
  //   }

  //   return stars;
  // };
  const renderStars = (rate) => {
    const star = []; // array to store the rate
    const fullStars = Math.floor(rate);
    console.log(fullStars);
    //check half of star
    const halfStar = rate - fullStars >= 0.5 ? 1 : 0;
    for (let i = 0; i < fullStars; i++) {
      star.push(
        <i key={`full-${i}`} className="fa-solid fa-star text-yellow-400"></i>
      );
    }
    for (let i = 0; i < halfStar; i++) {
      star.push(
        <i
          key={`half-${i}`}
          className="fa-solid fa-star-half-stroke text-yellow-400"
        ></i>
      );
    }
    return star;
  };
  // const handleDelete = () => {
  //   try {
  //   } catch (error) {
  //     console.log("Error delete: ", error);
  //   }
  // };
  return (
    <div className="flex flex-row  mt-2">
      <div className="detail flex-grow flex gap-x-4">
        <div className="flex items-center">
          <h4 className="font-bold">{username}</h4>
        </div>
        <div className="flex-grow">
          <p>{rate} sao</p>
          <div className="flex items-center gap-x-1 my-1">
            {renderStars(rate)}
          </div>
          <p className="mt-2">
            Ngày: {date} {time}
          </p>
          <p className="mt-3 bg-gray-200 p-3 rounded max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            Nhận xét: {content}
          </p>
        </div>
        <button
          // onClick={() => handleSetting()}
          className="option flex items-center hover:cursor-pointer"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  );
}

export default FeedbackItem;
