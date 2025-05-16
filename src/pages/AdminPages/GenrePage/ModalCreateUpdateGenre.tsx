import React, { useState, useEffect } from "react";
import { Modal, Input, Form, ConfigProvider } from "antd";
import { useAppDispatch } from "../../../redux/Store/Store.tsx";
import { createGenre, updateGenre } from "../../../redux/Slices/GenreSlice.tsx";
import { toast } from "react-toastify";

interface ModalCreateUpdateGenreProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id: string; name: string } | null; // nếu có dữ liệu thì là update
}

const ModalCreateUpdateGenre: React.FC<ModalCreateUpdateGenreProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({ name: initialData.name });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && initialData) {
        await dispatch(
          updateGenre({ genreId: initialData.id, name: values.name })
        );
        toast.success("Genre updated successfully!");
      } else {
        await dispatch(createGenre({ name: values.name }));
        console.log("Add genre success");
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
      }}
    >
      <Modal
        open={open}
        title={
          <span className="font-saira text-lg">
            {isEditMode ? "Update Genre" : "Create New Genre"}
          </span>
        }
        onOk={handleSubmit}
        onCancel={onClose}
        okText={<span className="font-saira">Save</span>}
        cancelText={<span className="font-saira">Cancel</span>}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="genreForm">
          <Form.Item
            label={<span className="font-saira">Genre Name</span>}
            name="name"
            rules={[{ required: true, message: "Please input genre name!" }]}
          >
            <Input className="font-saira" placeholder="Enter genre name" />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalCreateUpdateGenre;
