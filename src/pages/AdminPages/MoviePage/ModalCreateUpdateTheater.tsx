import { ConfigProvider, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import {
  createTheater,
  updateTheater,
} from "../../../redux/Slices/TheaterSlice.tsx";
import { toast, ToastContainer } from "react-toastify";

interface ModalCreateUpdateTheaterProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id: string; name: string; location: string } | null;
}

const ModalCreateUpdateTheater = (props: ModalCreateUpdateTheaterProps) => {
  const { onClose, open, initialData } = props;

  const dispatch = useAppDispatch();
  const { error, isLoading, listPerson } = useAppSelector(
    (state) => state.person
  );
  const [form] = Form.useForm();
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        location: initialData.location, // ✅ Gán location vào form
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
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
      }}
    >
      <Modal
        open={open}
        title={
          <span className="font-saira text-lg">
            {isEditMode ? "Update Theater" : "Create New Theater"}
          </span>
        }
        onOk={handleSubmit}
        onCancel={onClose}
        okText={<span className="font-saira">Save</span>}
        cancelText={<span className="font-saira">Cancel</span>}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="theaterForm">
          <Form.Item
            label={<span className="font-saira">Theater Name</span>}
            name="name"
            rules={[{ required: true, message: "Please input theater name!" }]}
          >
            <Input className="font-saira" placeholder="Enter theater name" />
          </Form.Item>

          <Form.Item
            label={<span className="font-saira">Theater Location</span>}
            name="location"
            rules={[
              { required: true, message: "Please input theater location!" },
            ]}
          >
            <Input
              className="font-saira"
              placeholder="Enter theater location"
            />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalCreateUpdateTheater;
