import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Select, DatePicker, Button, ConfigProvider } from "antd";
import dayjs, { Dayjs } from "dayjs";
import instance from "../../../api/instance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import {
  createActor,
  createDirector,
  updatePerson,
} from "../../../redux/slices/PersonSlice.tsx";
import { LeftOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateUpdatePersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isLoading, listPerson } = useAppSelector(
    (state) => state.person
  );

  const [person, setPerson] = useState({
    name: "",
    gender: true,
    dateOfBirth: null as Dayjs | null,
    job: undefined as string | undefined,
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref để reset input file

  useEffect(() => {
    if (id) {
      const personInfo = listPerson.find((p) => p.id === id);

      if (personInfo) {
        setPerson({
          name: personInfo.name,
          gender: personInfo.gender,
          dateOfBirth: personInfo.dateOfBirth
            ? dayjs(personInfo.dateOfBirth, "DD-MM-YYYY")
            : null,
          job: personInfo.job.name,
          image: null,
        });
        setPreview(personInfo.image);
      }
    }
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setPerson((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPerson((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
      setPerson((prev) => ({ ...prev, image: null }));
    }
    console.log("File selected:", file); // Debug
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!person.dateOfBirth) {
      toast.error("Please select date of birth.");
      return;
    }

    const params = {
      name: person.name,
      gender: person.gender,
      dateOfBirth: person.dateOfBirth.format("YYYY-MM-DD"),
    };

    try {
      console.log("Request params: ", params);
      console.log("Image: ", preview);

      if (id) {
        await dispatch(
          updatePerson({
            personId: id,
            updatePersonRequest: params,
            image: person.image || null,
          })
        ).unwrap();
        toast.success("Person updated successfully!");
        setTimeout(() => navigate("/admin/persons"), 1000);
      } else {
        if (person.job === "Actor") {
          await dispatch(
            createActor({ createPersonRequest: params, image: person.image })
          ).unwrap();
          toast.success("Actor created successfully!");
        } else if (person.job === "Director") {
          await dispatch(
            createDirector({ createPersonRequest: params, image: person.image })
          ).unwrap();
          toast.success("Director created successfully!");
        } else {
          toast.error("Please select a valid job (Actor or Director).");
          return;
        }
        setTimeout(() => navigate("/admin/persons"), 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create or update person.");
      console.log("Error: ", error);
    }
  };

  const handleClickGoBack = () => {
    navigate(-1);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setPerson((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input file
    }
  };

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
          Input: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
          },
          DatePicker: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            colorBgElevated: "#323D4E",
          },
        },
      }}
    >
      <div className="text-white">
        <ToastContainer />
        <div className="flex items-center mb-8">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={handleClickGoBack}
            className="text-white mr-4 font-saira transition-all duration-300 ease-in-out hover:!text-blue-400 hover:scale-110"
          />
          <span className="text-3xl font-saira">
            {id ? "Edit Person" : "Add New Person"}
          </span>
        </div>
        <div className="w-full bg-[#273142] p-10 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Upload image */}
            <div className="mb-6 flex flex-col items-center">
              <label className="mb-2 text-lg font-saira">Image</label>
              <div className="relative w-[160px] h-[220px] bg-[#323D4E] rounded-xl overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-center px-4 font-saira">
                    No image selected
                  </span>
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button
                  type="primary"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 !bg-blue-500 hover:!bg-blue-600 !text-white !text-sm !px-2 !py-1"
                >
                  Select image
                </Button>
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Full Name</label>
                <Input
                  placeholder="Enter name"
                  value={person.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Gender</label>
                <Select
                  value={person.gender}
                  onChange={(value) => handleChange("gender", value)}
                >
                  <Option value={true}>Male</Option>
                  <Option value={false}>Female</Option>
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Date of Birth</label>
                <DatePicker
                  value={person.dateOfBirth}
                  onChange={(date) => handleChange("dateOfBirth", date)}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Job</label>
                <Select
                  placeholder="Select job"
                  allowClear
                  value={person.job}
                  onChange={(value) => handleChange("job", value)}
                >
                  <Option value="Actor">Actor</Option>
                  <Option value="Director">Director</Option>
                </Select>
              </div>
            </div>

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
              {id ? "Update Person" : "Add Now"}
            </Button>
          </form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreateUpdatePersonPage;
