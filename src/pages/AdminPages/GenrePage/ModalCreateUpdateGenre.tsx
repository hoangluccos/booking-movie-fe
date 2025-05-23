import React, { useState, useEffect } from "react";
import { Modal, Input, ConfigProvider } from "antd";
import { useAppDispatch } from "../../../redux/store/store.tsx";
import { createGenre, updateGenre } from "../../../redux/slices/GenreSlice.tsx";
import { toast } from "react-toastify";
import { CloseOutlined } from "@ant-design/icons";

interface ModalCreateUpdateGenreProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id: string; name: string } | null;
}

const ModalCreateUpdateGenre: React.FC<ModalCreateUpdateGenreProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(initialData);
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName("");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Please input genre name!");
      return;
    }

    try {
      if (isEditMode && initialData) {
        await dispatch(updateGenre({ genreId: initialData.id, name }));
        toast.success("Genre updated successfully!");
      } else {
        await dispatch(createGenre({ name }));
        toast.success("Genre created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save genre.");
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
            {isEditMode ? "Update Genre" : "Create New Genre"}
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
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        destroyOnClose
      >
        <div className="space-y-6">
          <div>
            <label className="text-white mb-2 block text-[16px] font-saira">
              Genre Name
            </label>
            <Input
              className="font-saira"
              placeholder="Enter genre name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalCreateUpdateGenre;
