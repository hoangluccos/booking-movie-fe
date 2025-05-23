import React from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import ImageSlider from "../../ImageSlider";
import NavResponsive from "../../NavResponsive";

function CommonLayout({ children }) {
  return (
    <div className="bg-[#0f172a]">
      <Header />
      <NavResponsive />
      <div className="pt-[160px] image_banner">
        <ImageSlider />
      </div>
      {children}
      <Footer />
    </div>
  );
}

export default CommonLayout;
