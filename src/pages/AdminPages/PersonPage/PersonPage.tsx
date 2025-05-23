import {
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Popconfirm,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { PersonType } from "../Data/Data";
import patternBg from "../../../assets/Pattern.png";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import {
  deletePerson,
  getAllPersons,
} from "../../../redux/slices/PersonSlice.tsx";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const PersonPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { error, isLoading, listPerson } = useAppSelector(
    (state) => state.person
  );

  useEffect(() => {
    dispatch(getAllPersons());
    console.log("List Person: ", listPerson);
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Lọc danh sách người theo tên
  const filteredPersons = listPerson.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showPersonCus = (
    item: PersonType,
    onClickEdit: (item: PersonType) => void,
    onClickDelete: (item: PersonType) => void
  ) => {
    return (
      <Card
        hoverable
        className="group w-full max-w-[350px] max-h-[400px] text-center overflow-hidden relative bg-[#293243] rounded-xl mx-auto border-none"
        cover={
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${patternBg})`,
              backgroundRepeat: "repeat",
              backgroundSize: "cover",
            }}
          />
        }
      >
        {/* Hover buttons */}
        <div className="absolute top-2 right-2 z-20 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out flex space-x-2 backdrop-blur-md p-2 rounded-lg">
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              className="hover:scale-110 transform transition duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onClickEdit(item);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title={
                <span className="font-saira text-sm">
                  Are you sure to delete this person?
                </span>
              }
              description={
                <span className="font-saira text-sm">
                  {`Name: "${item.name}"`}
                  <br />
                  {`Job: "${item.job.name}"`}
                </span>
              }
              onConfirm={() => onClickDelete(item)}
              onCancel={() => {}}
              okText={<span className="font-saira">Yes</span>}
              cancelText={<span className="font-saira">No</span>}
              okType="danger"
            >
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                className="hover:scale-110 transform transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </Popconfirm>
          </Tooltip>
        </div>

        {/* Content */}
        <div className="relative z-10 py-6 px-4">
          <div className="flex justify-center items-center h-52">
            <Avatar
              src={item.image}
              size={200}
              className="text-4xl font-saira shadow-lg rounded-full"
            />
          </div>
          <div className="text-white text-xl font-bold font-saira mt-4">
            {item.name}
          </div>
          <div className="text-[#b0b8c1] text-base mt-1 font-saira">
            {item.job.name}
          </div>
          <div className="text-[#b0b8c1] text-base mt-1 font-saira">
            {item.dateOfBirth}
          </div>
          <div className="text-[#b0b8c1] text-base mt-1 font-saira">
            {item.gender ? "Male" : "Female"}
          </div>
        </div>
      </Card>
    );
  };

  const handleEditPerson = (item: PersonType) => {
    navigate(`/admin/persons/edit/${item.id}`);
  };

  const handleDeletePerson = (item: PersonType) => {
    dispatch(deletePerson({ personId: item.id }));
    toast.success("Person deleted successfully!");
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tooltip: {
            colorBgSpotlight: "#1F2937",
            colorTextLightSolid: "#FFFFFF",
            borderRadius: 6,
            fontSize: 13,
            padding: 8,
            fontFamily: "Saira, sans-serif",
          },
        },
      }}
    >
      <div className="relative min-h-[600px] space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-white text-3xl font-saira">Persons</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#323D4E] px-4 rounded-full space-x-2">
              <IoIosSearch size={20} color="gray" />
              <input
                className="bg-[#323D4E] w-[253px] h-[38px] focus:outline-none text-white placeholder-gray-400 font-saira"
                type="text"
                placeholder="Search person name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              type="primary"
              className="w-[147px] h-[48px] rounded-lg font-saira"
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
                padding: "8px 48px",
                borderRadius: "8px",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onClick={() => navigate("/admin/persons/create")}
            >
              Add New Person
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[705px] overflow-y-scroll scrollbar-hidden">
          {filteredPersons.length > 0 ? (
            filteredPersons.map((item) => (
              <div key={item.id}>
                {showPersonCus(
                  item,
                  () => handleEditPerson(item),
                  () => handleDeletePerson(item)
                )}
              </div>
            ))
          ) : (
            <div className="text-white text-center py-4">No person found</div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PersonPage;
