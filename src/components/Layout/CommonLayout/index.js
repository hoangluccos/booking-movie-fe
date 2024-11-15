import React from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import ImageSlider from "../../ImageSlider";

function CommonLayout({ children }) {
  return (
    <div className="bg-full">
      <Header />
      <ImageSlider />

      {children}
      <Footer />
    </div>
  );
}

export default CommonLayout;
