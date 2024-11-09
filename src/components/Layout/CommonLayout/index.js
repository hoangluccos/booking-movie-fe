import React from "react";
import Header from "../../Header";
import Footer from "../../Footer";

function CommonLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default CommonLayout;
