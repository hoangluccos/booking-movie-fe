import React from "react";
import Header from "../../Header";
import Footer from "../../Footer";

function NotSlider({ children }) {
  return (
    <div className="">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default NotSlider;
