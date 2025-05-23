import { ConfigProvider, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/store/store.tsx";
import {
  createTheater,
  updateTheater,
} from "../../../redux/slices/TheaterSlice.tsx";
import { toast } from "react-toastify";

interface ModalCreateUpdateTheaterProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id: string; name: string; location: string } | null;
}

const ModalCreateUpdateTheater = (props: ModalCreateUpdateTheaterProps) => {
  const { onClose, open, initialData } = props;

  const dispatch = useAppDispatch();
  const isEditMode = Boolean(initialData);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLocation(initialData.location);
    } else {
      setName("");
      setLocation("");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Please input theater name!");
      return;
    }
    if (!location) {
      toast.error("Please input theater location!");
      return;
    }

    try {
      const values = { name, location };
      if (isEditMode && initialData) {
        await dispatch(updateTheater({ theaterId: initialData.id, ...values }));
        toast.success("Theater updated successfully!");
      } else {
        await dispatch(createTheater(values));
        toast.success("Theater created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save theater.");
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
            {isEditMode ? "Update Theater" : "Create New Theater"}
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
          <div>
            <label className="text-white mb-2 block text-[16px] font-saira">
              Theater Name
            </label>
            <Input
              className="font-saira"
              placeholder="Enter theater name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white mb-2 block text-[16px] font-saira">
              Theater Location
            </label>
            <Input
              className="font-saira"
              placeholder="Enter theater location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalCreateUpdateTheater;
