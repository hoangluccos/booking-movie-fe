import React, { useState } from "react";
import { Modal } from "antd";
function CouponItem({ img, title, detail, couponData }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleCancel = () => {
    setIsOpenModal(false);
  };
  return (
    <>
      <button
        onClick={showModal}
        className="item m-3 w-[28%] h-[300px] select-none"
      >
        <div className="h-[200px] w-full">
          <img
            src={img}
            alt=""
            className="w-full h-full rounded-md object-cover"
          />
        </div>
        <h4 className="font-bold mt-3">{title}</h4>
        <p className="font-light text-[17px]">{detail}</p>
      </button>
      <Modal
        title={title}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpenModal}
        onCancel={handleCancel}
        onOk={handleCancel}
        footer={null}
      >
        <div className="min-w-full h-[300px]">
          <div className="w-full h-[200px]">
            <img
              src={couponData.image}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <p className="font-bold text-xl mt-1">
            Voucher discount {couponData.discountValue.toLocaleString()}
            {couponData.discountType === "Other"
              ? " Chỉ 88k"
              : couponData.discountType === "Fixed"
              ? "K"
              : "%"}
          </p>
          <p>{detail}</p>
        </div>
      </Modal>
    </>
  );
}

export default CouponItem;
