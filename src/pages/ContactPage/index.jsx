import React from "react";
import GroupImage from "../../assets/anhNhom.jpg";
function ContactPage() {
  return (
    <div className="content mt-4 flex gap-8">
      <div className="w-[50%] rounded mt-4">
        <img className="w-full" src={GroupImage} alt="" />
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-bold">HL team</h2>
        <h3>This project belong to HoangLuc - QuocHuy</h3>
        <p>Location : 1-Vo Van Ngan - Thu Duc - Ho Chi Minh City</p>
      </div>
    </div>
  );
}

export default ContactPage;
