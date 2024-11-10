import React from "react";
import "./ProductItem.scss";

function ProductItem({ image, title, subtitle }) {
  return (
    <div className="product-item ">
      <img src={image} alt={title} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export default ProductItem;
