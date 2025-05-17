import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { InputNumber, Select, Button, ConfigProvider, Form, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import { createRoom } from "../../../redux/Slices/RoomSlice.tsx";
import { TheaterType } from "../Data/Data.tsx";

const { Option } = Select;

const CreateRoomPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const theaterItem = location.state as TheaterType;
  const { isLoading, error } = useAppSelector((state) => state.room);

  const [roomType, setRoomType] = useState<string | undefined>(undefined);
  const [numRows, setNumRows] = useState<number>(0);

  const onFinish = async (values: any) => {
    const rows = Array.from({ length: values.numRows }, (_, i) =>
      String.fromCharCode(65 + i)
    );

    if (values.roomType === "couple" && values.numColumns % 2 !== 0) {
      toast.error("Number of columns must be even for couple room.");
      return;
    }

    if (values.roomType === "couple") {
      for (const r of values.coupleRows || []) {
        if (!rows.includes(r)) {
          toast.error(`Couple row ${r} does not exist.`);
          return;
        }
      }
    }

    const params = {
      name: values.name,
      rows: values.numRows,
      columns: values.numColumns,
      coupleRows: values.roomType === "couple" ? values.coupleRows || [] : [],
    };

    try {
      await dispatch(
        createRoom({ theaterId: theaterItem.id, createRoomRequest: params })
      ).unwrap();

      toast.success("Room created successfully!");
      setTimeout(() => {
        navigate(`/admin/theaters/${theaterItem.id}`, { state: theaterItem });
      }, 1000);
    } catch (err) {
      console.error("Failed to create room:", err);
      toast.error("Failed to create room.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Select: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            optionSelectedBg: "#1e2632",
            selectorBg: "#323D4E",
            colorBgElevated: "#323D4E",
          },
          InputNumber: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
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
            borderRadius: 8,
          },
        },
      }}
    >
      <div className="text-white">
        <ToastContainer />
        <span className="text-3xl mb-8 flex font-saira">Create Room</span>
        <div className="w-full bg-[#273142] p-10 rounded-2xl shadow-lg">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{
              roomType: undefined,
              numRows: null,
              numColumns: null,
              coupleRows: [],
            }}
            className="flex flex-col items-center"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Type */}
              <Form.Item
                label={
                  <span className="text-[16px] font-saira text-white">
                    Room Type
                  </span>
                }
                name="roomType"
                rules={[{ required: true, message: "Please select room type" }]}
              >
                <Select
                  placeholder="Select room type"
                  onChange={(value) => {
                    setRoomType(value);
                    form.setFieldsValue({ coupleRows: [] });
                  }}
                  allowClear
                >
                  <Option value="normal">Normal Room</Option>
                  <Option value="couple">Couple Room</Option>
                </Select>
              </Form.Item>

              {/* Name */}
              <Form.Item
                label={
                  <span className="text-[16px] font-saira text-white">
                    Name
                  </span>
                }
                name="name"
                rules={[{ required: true, message: "Please enter room name" }]}
              >
                <Input placeholder="Enter room name" disabled={!roomType} />
              </Form.Item>

              {/* Number of Rows */}
              <Form.Item
                label={
                  <span className="text-[16px] font-saira text-white">
                    Number of Rows
                  </span>
                }
                name="numRows"
                rules={[
                  { required: true, message: "Please enter number of rows" },
                  {
                    type: "number",
                    min: 1,
                    max: 26,
                    message: "Rows must be between 1 and 26",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  max={26}
                  disabled={!roomType}
                  placeholder="Enter number of rows"
                  onChange={(value) => {
                    setNumRows(value || 0);
                    form.setFieldsValue({ coupleRows: [] });
                  }}
                />
              </Form.Item>

              {/* Number of Columns */}
              <Form.Item
                label={
                  <span className="text-[16px] font-saira text-white">
                    Number of Columns
                  </span>
                }
                name="numColumns"
                rules={[
                  { required: true, message: "Please enter number of columns" },
                  {
                    type: "number",
                    min: 1,
                    message: "Columns must be greater than 0",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  disabled={!roomType}
                  placeholder="Enter number of columns"
                />
              </Form.Item>
            </div>

            {/* Couple Rows */}
            {roomType === "couple" && numRows > 0 && (
              <Form.Item
                label={
                  <span className="text-[16px] font-saira text-white">
                    Couple Rows
                  </span>
                }
                name="coupleRows"
                tooltip={
                  <span className="font-saira text-white">
                    Select which rows are couple seats
                  </span>
                }
                className="w-full mt-6"
              >
                <Select
                  mode="multiple"
                  placeholder="Select couple rows"
                  allowClear
                  disabled={!numRows}
                >
                  {Array.from({ length: numRows }, (_, i) => {
                    const row = String.fromCharCode(65 + i);
                    return (
                      <Option key={row} value={row}>
                        {row}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              className="mt-8 h-[56px] w-[200px]"
              loading={isLoading}
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
            >
              Create Room
            </Button>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreateRoomPage;
