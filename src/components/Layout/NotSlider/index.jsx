import React from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import NavResponsive from "../../NavResponsive";

function NotSlider({ children }) {
  return (
    <div className="flex flex-col">
      <Header />
      <NavResponsive />
      <div className="pt-[160px] min-h-[600px] image_banner">{children}</div>
      <Footer />
    </div>
  );
}

export default NotSlider;
