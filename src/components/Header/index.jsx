import React, { useCallback, useEffect, useState } from "react";
import { FaUserCircle, FaTimes, FaFilm } from "react-icons/fa";
import instance from "../../api/instance";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchItem from "../SearchItem";
import { IoIosNotifications } from "react-icons/io";
import IMG_TICKET from "../../assets/random_partner.png";
import ButtonNavHeader from "../ButtonNavHeader";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Badge, Dropdown, Menu } from "antd";
import { CheckOutlined, NotificationOutlined } from "@ant-design/icons";

function Header() {
  const [listMovies, setListMovies] = useState([]);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User: ", user);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || null
  );
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");
  const { connect, isConnected, disconnect, isLoading } = useWebSocket();
  const [notifications, setNotifications] = useState([]); //400: not yet hand have rq , 200: matching_success , 201: create ticket successfully
  const navigate = useNavigate();
  const location = useLocation();

  const handleNotificationSocket = useCallback((data) => {
    setNotifications((prev) => [...prev, data]);
  }, []);

  // Lấy danh sách phim và userId khi có token
  useEffect(() => {
    const fetchListMovies = async () => {
      try {
        const res = await instance.get("/movies/");
        const data = res.data.result;
        setListMovies(
          data.map((movie) => ({
            name: movie.name,
            image: movie.image,
            id: movie.id,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };
    fetchListMovies();

    if (token) {
      const fetchUserId = async () => {
        try {
          const resMybio = await instance.get("/users/bio");
          console.log("Đã set userId:", resMybio.data.result.id);
          setUserId(resMybio.data.result.id || "");
        } catch (error) {
          console.error("Lỗi khi lấy userId:", error);
          toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại!");
        }
      };
      fetchUserId();
    } else {
      console.log("Không có token, reset userId");
      setUserId("");
    }
  }, [token]);

  // Kết nối WebSocket khi có userId
  useEffect(() => {
    console.log(
      "WebSocket useEffect - userId:",
      userId,
      "isConnected:",
      isConnected,
      "path:",
      location.pathname
    );
    if (userId && !isConnected) {
      console.log("Tiến hành kết nối socket với userId:", userId);
      try {
        console.log("Before calling connectSocket");
        connect(userId, handleNotificationSocket)
          .then(() => {
            console.log("WebSocket connect attempt successful");
          })
          .catch((error) => {
            console.error("WebSocket connect failed:", error);
            toast.error("Không thể kết nối WebSocket. Vui lòng thử lại!");
          });
        console.log("After calling connectSocket");
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    } else if (!userId && isConnected) {
      console.log("Ngắt kết nối WebSocket do không có userId");
      disconnect();
    }

    return () => {
      console.log(
        "Cleanup: Disconnecting WebSocket due to unmount or page change"
      );
      if (isConnected) {
        disconnect();
      }
    };
  }, [
    userId,
    isConnected,
    connect,
    handleNotificationSocket,
    location.pathname,
  ]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    (async () => {
      try {
        await instance.post("/auth/logout", token);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUserId("");
        disconnect();
        toast.success("Bạn đã đăng xuất thành công!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        toast.error("Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại!");
      }
    })();
  };

  // Xử lý tìm kiếm
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const fetchSearch = async () => {
        try {
          const res = await instance.get("/movies/search", {
            params: { value: search },
          });
          if (res.data.result.length >= 1) {
            navigate("/search", { state: { listMovies: res.data.result } });
          }
        } catch (error) {
          console.error("Lỗi khi tìm kiếm:", error);
        }
      };
      fetchSearch();
    }
  };

  const handleChangeSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value);
      const timeout = setTimeout(() => {
        if (value) {
          const suggest = listMovies.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestedMovies(suggest);
        } else {
          setSuggestedMovies([]);
        }
      }, 500);
      return () => clearTimeout(timeout);
    },
    [listMovies]
  );

  //handle toggle notification
  const handleToggleNotify = async (idNotify) => {
    console.log("id notify", idNotify);
    try {
      const res = await instance.put(`/notifies/${idNotify}`);
      console.log(res.data.result);
    } catch (error) {
      console.log("Fail to toggle message", error);
    }
  };

  //handle redirect into matching_success page
  const handleMatchingSuccess = () => {
    const isCreateTicket = notifications.find(
      (noti) => noti.code === 201 //"Tạo vé thành công"
    );
    if (isCreateTicket) {
      const props = {
        dataPartner: null,
        dataTicket: null,
      };
      const isMatched = notifications.find(
        (noti) => noti.code === 200 //"Ghép đôi thành công"
      );
      if (isMatched) {
        props.dataPartner = isMatched.result;
        props.dataTicket = isCreateTicket.result;
      }
      toast.success("Hệ thống đã tìm được partner cho bạn!");
      setTimeout(() => {
        // disconnect();
        navigate("/matching_success", { state: props });
      }, 1000);
    }
  };

  // Menu thông báo cho Dropdown
  const notificationMenu = (
    <Menu style={{ marginTop: "10px", maxHeight: "300px", overflowY: "auto" }}>
      {notifications.length > 0 ? (
        notifications.map((notification, id) => (
          <Menu.Item
            key={id}
            style={{
              height: "50px",
            }}
          >
            <div className="flex items-center justify-between w-full gap-1">
              <div className="flex items-center">
                <NotificationOutlined
                  style={{
                    fontSize: "16px",
                    marginRight: "8px",
                    color: "#1890ff",
                  }}
                />
                <button
                  onClick={handleMatchingSuccess}
                  className="font-bold text-[#888] m-0"
                >
                  {notification.message}
                </button>
              </div>
              <CheckOutlined
                style={{
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#1890ff",
                  transition: "color 0.3s, transform 0.3s",
                }}
                onClick={() => handleToggleNotify(notification.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2268A7";
                  e.currentTarget.style.transform = "scale(1.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#1890ff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item>
          <div>Không có thông báo</div>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="select-none">
      <div className="w-full bg-[#0f172a] fixed top-0 left-0 z-50 p-2.5 nav_ab">
        <header className="max-w-[1200px] mx-auto flex flex-col p-2.5 items-center">
          <div className="flex items-center justify-between mb-2 w-full">
            <div className="flex items-center">
              <Link to={"/"}>
                <FaFilm className="text-white text-4xl mr-2" />
              </Link>
              <div className="search-input relative w-full max-w-[900px] min-w-[500px] flex-grow">
                <div className="flex items-center bg-[#f5f5f5] rounded-full p-1.5 mr-2 flex-grow min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search"
                    className="outline-none border-none bg-transparent px-2 py-1 text-[#333] text-sm w-full"
                    value={search}
                    onChange={handleChangeSearch}
                    onKeyDown={handleKeyDown}
                  />
                  <FaTimes
                    className="text-[#666] text-2xl cursor-pointer mr-2 hover:bg-gray-300 rounded-lg p-1"
                    onClick={() => {
                      setSearch("");
                      setSuggestedMovies([]);
                    }}
                  />
                </div>
                {suggestedMovies.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-10">
                    {suggestedMovies.map((movie, index) => (
                      <SearchItem key={index} data={movie} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Link
                className="matching-feature mt-1 w-[150px] h-[60px]"
                style={{
                  background: `url(${IMG_TICKET})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                }}
                to={"/matching"}
              ></Link>
              <div className="relative inline-block group">
                <div className="pb-2 mt-2">
                  <FaUserCircle className="text-white text-3xl cursor-pointer mr-2" />
                </div>
                {user || token ? (
                  <div className="absolute top-full right-0 bg-[#333] rounded-lg py-1 shadow-lg min-w-[160px] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      to="/profile"
                      className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
                    >
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to="/history-payment"
                      className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
                    >
                      Lịch sử thanh toán
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i> Đăng
                      xuất
                    </button>
                  </div>
                ) : (
                  <div className="absolute top-full right-0 bg-[#333] rounded-lg py-1 shadow-lg min-w-[160px] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      to="/login"
                      className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative inline-block">
                <Badge count={notifications.length} offset={[-10, 10]}>
                  <Dropdown
                    overlay={notificationMenu}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <IoIosNotifications
                      className="text-white text-4xl cursor-pointer mr-2"
                      onClick={(e) => e.preventDefault()}
                    />
                  </Dropdown>
                </Badge>
              </div>
            </div>
          </div>

          <div className="navigation_desktop flex justify-evenly gap-10 w-full mt-2 mb-3">
            <ButtonNavHeader navTo={"/"} text={"TRANG CHỦ"} />
            <ButtonNavHeader navTo={"/theaters"} text={"RẠP PHIM"} />
            <ButtonNavHeader navTo={"/contact"} text={"LIÊN HỆ"} />
            <ButtonNavHeader navTo={"/coupons"} text={"ƯU ĐÃI"} />
          </div>
        </header>
      </div>
    </div>
  );
}

export default Header;
