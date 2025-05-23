import React, { useState, useEffect } from "react";
import { Modal, Input, ConfigProvider, Button, InputNumber } from "antd";
import { useAppDispatch } from "../../../redux/Store/Store.tsx";
import { createFood, updateFood } from "../../../redux/Slices/FoodSlice.tsx";
import { toast } from "react-toastify";

interface ModalCreateUpdateFoodProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  } | null;
}

const ModalCreateUpdateFood: React.FC<ModalCreateUpdateFoodProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(initialData);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setPreview(initialData.image || null);
      setImage(null);
    } else {
      setName("");
      setPrice(null);
      setPreview(null);
      setImage(null);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Please input food name!");
      return;
    }
    if (!price || price <= 0) {
      toast.error("Price must be greater than 0!");
      return;
    }

    try {
      const params = {
        name,
        price,
      };

      if (isEditMode && initialData) {
        await dispatch(
          updateFood({
            foodId: initialData.id,
            foodData: params,
            image: image || initialData.image || null,
          })
        ).unwrap();
        toast.success("Food updated successfully!");
      } else {
        await dispatch(createFood({ foodData: params, image })).unwrap();
        toast.success("Food created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save food.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Modal: {
            colorBgContainer: "#273142",
            colorBgElevated: "#273142",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorBgMask: "rgba(0, 0, 0, 0.8)",
          },
          Input: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
          },
          InputNumber: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
          },
          Button: {
            controlHeight: 48,
            colorBgContainer: "#3b82f6",
            colorBorder: "#3b82f6",
            borderRadius: 8,
            colorText: "white",
            defaultHoverBg: "#2563eb",
            defaultHoverBorderColor: "#2563eb",
          },
        },
      }}
    >
      <Modal
        open={open}
        title={
          <span className="font-saira text-lg text-white">
            {isEditMode ? "Update Food" : "Create New Food"}
          </span>
        }
        onOk={handleSubmit}
        onCancel={onClose}
        okText={<span className="font-saira">Save</span>}
        cancelText={<span className="font-saira">Cancel</span>}
        cancelButtonProps={{
          className:
            "font-saira !bg-gray-500 !border-gray-500 !text-white hover:!bg-gray-600 hover:!border-gray-600",
        }}
        destroyOnClose
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <label className="text-white mb-2 block text-lg font-saira">
              Food Image
            </label>
            <div className="relative w-[200px] h-[150px] bg-[#323D4E] rounded-xl flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-center text-sm px-4 font-saira">
                  No image selected
                </span>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button
                type="primary"
                size="small"
                onClick={() => document.getElementById("image")?.click()}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 font-saira !bg-blue-500 hover:!bg-blue-600 !text-white !text-sm !px-2 !py-1 !rounded-md"
              >
                Select image
              </Button>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-white mb-2 block text-[16px] font-saira">
              Food Name
            </label>
            <Input
              className="font-saira"
              placeholder="Enter food name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white mb-2 block text-[16px] font-saira">
              Price
            </label>
            <InputNumber
              className="font-saira w-full"
              placeholder="Enter food price"
              step={0.01}
              min={0.01}
              value={price}
              onChange={(value) => setPrice(value as number | null)}
              formatter={(value) =>
                value && Number(value) > 1000
                  ? `${Number(value).toLocaleString("vi-VN")}`
                  : `${value}`
              }
              parser={(value: string | undefined): number =>
                value ? parseFloat(value.replace(/\./g, "")) : 0.01
              }
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalCreateUpdateFood;
