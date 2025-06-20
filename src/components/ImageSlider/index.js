import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = () => {
  const images = [
    "https://i.ytimg.com/vi/8l4crgVt36Y/maxresdefault.jpg",
    "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fbap-nuoc-onl.webp&w=1920&q=50",
    "https://i.ytimg.com/vi/q-wr0JDcvVk/maxresdefault.jpg",
    "https://www.bhdstar.vn/wp-content/uploads/2025/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight1069ldapp-2.jpg",
    "https://www.bhdstar.vn/wp-content/uploads/2025/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight1069ldapp-1.jpg",
    "https://www.bhdstar.vn/wp-content/uploads/2025/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight1069ldapp.jpg",
    "https://www.bhdstar.vn/wp-content/uploads/2025/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight1069ldapp-1.png",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="content">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="h-[400px] w-full">
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="slide-image w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
