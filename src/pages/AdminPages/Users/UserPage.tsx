import React, { useEffect } from "react";
import { UserType } from "../Data/Data";
import { Avatar, Button, Popconfirm, Skeleton, ConfigProvider } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { getAllUsers, updateStatus } from "../../../redux/slices/UserSlice.tsx";
import { toast } from "react-toastify";

const UserPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, listUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleConfirmToggleStatus = async (item: UserType) => {
    try {
      await dispatch(updateStatus(item.id));
      toast.success(
        item.status
          ? "User has been banned successfully!"
          : "User has been unbanned successfully!"
      );
    } catch (error) {
      toast.error("Failed to update user status!");
    }
  };

  const showUserCus = (item: UserType) => {
    const isActive = item.status;
    const initials = (item.firstName?.[0] || "") + (item.lastName?.[0] || "");

    return (
      <div className="bg-[#273142] rounded-xl overflow-hidden shadow-lg w-full">
        {item.avatar ? (
          <img
            src={item.avatar}
            alt={`${item.firstName} ${item.lastName}`}
            className="w-full h-[276px] object-cover"
          />
        ) : (
          <div className="w-full h-[276px] flex justify-center items-center bg-gray-500">
            <Avatar
              style={{
                backgroundColor: "#7265e6",
                verticalAlign: "middle",
                width: 100,
                height: 100,
                fontSize: 36,
                fontFamily: "Saira",
              }}
            >
              {initials.toUpperCase()}
            </Avatar>
          </div>
        )}

        <div className="p-4 text-center">
          <h3 className="text-white text-lg font-saira">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-gray-400 text-sm mb-4 font-saira">{item.email}</p>

          <Popconfirm
            title={
              <span className="font-saira text-sm">
                {`Confirm ${isActive ? "Ban" : "Unban"} User`}
              </span>
            }
            description={
              <span className="font-saira text-sm">
                {`Are you sure you want to ${isActive ? "Ban" : "Unban"} "${
                  item.firstName
                } ${item.lastName}"?`}
              </span>
            }
            onConfirm={() => handleConfirmToggleStatus(item)}
            okText={<span className="font-saira text-sm">Confirm</span>}
            cancelText={<span className="font-saira text-sm">Cancel</span>}
            okType={isActive ? "danger" : "primary"}
            placement="top"
          >
            <Button
              type="primary"
              danger={!isActive}
              className="mt-2 font-saira"
              style={{
                backgroundColor: isActive ? "#52c41a" : "#ff4d4f",
                borderColor: isActive ? "#52c41a" : "#ff4d4f",
                width: 100,
                height: 32,
              }}
              loading={isLoading}
            >
              {isActive ? "Active" : "Banned"}
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const renderSkeleton = () =>
    [...Array(8)].map((_, idx) => (
      <div
        key={idx}
        className="bg-[#273142] rounded-xl overflow-hidden shadow-lg w-full"
      >
        <div className="w-full h-[276px] bg-gray-500">
          <Skeleton.Image
            active
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#3A4657",
            }}
          />
        </div>
        <div className="p-4 text-center">
          <Skeleton
            active
            title={{ width: "80%" }}
            paragraph={false}
            style={{
              marginBottom: 16,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Skeleton
            active
            title={{ width: "90%" }}
            paragraph={false}
            style={{
              marginBottom: 16,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Skeleton.Button
            active
            size="small"
            style={{
              width: 100,
              height: 32,
              borderRadius: 4,
              margin: "0 auto",
            }}
          />
        </div>
      </div>
    ));

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Button: {
            colorText: "#FFFFFF",
            colorBgContainer: "#52c41a",
            colorBorder: "transparent",
            borderRadius: 4,
          },
          Popconfirm: {
            colorBgElevated: "#ffffff",
            colorText: "#000000",
            colorPrimary: "#ff4d4f",
            borderRadius: 8,
          },
          Skeleton: {
            color: "#3A4657",
            colorGradientEnd: "#2A3444",
          },
        },
      }}
    >
      <div className="space-y-6 p-4">
        <span className="text-white text-3xl font-saira">Users</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[670px] overflow-y-scroll scrollbar-hidden">
          {isLoading ? (
            renderSkeleton()
          ) : listUser.length > 0 ? (
            listUser.map((item) => <div key={item.id}>{showUserCus(item)}</div>)
          ) : (
            <div className="text-white text-center py-4 col-span-full">
              No users found
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default UserPage;
