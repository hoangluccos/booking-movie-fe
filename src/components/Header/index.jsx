import React, { useEffect, useState } from "react";
import { FaUserCircle, FaTimes, FaFilm } from "react-icons/fa";
import instance from "../../api/instance";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Header.css";
import SearchItem from "../SearchItem";
function Header() {
  const [listMovies, setListMovies] = useState([]);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  console.log(listMovies);

  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User: ", user);
  const [Search, setSearch] = useState("");
  console.log(Search);
  const handleLogout = () => {
    (async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        await instance.post("/auth/logout", token);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Bạn đã logout");
        setTimeout(() => {
          nav("/login");
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Enter ");
      const fetchSearch = async () => {
        try {
          const res = await instance.get("/movies/search", {
            params: { value: Search },
          });
          console.log(res);
          if (res.data.result.length >= 1) {
            nav("/search", { state: { listMovies: res.data.result } });
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchSearch();
    }
  };
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await instance.get("/movies/");
        console.log(res.data.result);
        const data = res.data.result;
        setListMovies(
          data.map((movie) => ({
            name: movie.name,
            image: movie.image,
            id: movie.id,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchSearch();
  }, []);
  const handleChangeSearch = (e) => {
    console.log(e.target.value);
    // console.log(
    //   listMovies.filter((item) => item.toLowerCase().includes(e.target.value))
    // );
    setTimeout(() => {
      if (e.target.value) {
        const suggest = listMovies.filter((item) =>
          item.name.toLowerCase().includes(e.target.value)
        );
        console.log(suggest);
        setSuggestedMovies(suggest);
      } else {
        setSuggestedMovies([]);
      }
    }, 500);
    setSearch(e.target.value);
  };
  return (
    <div className=" select-none">
      <ToastContainer />
      <header className="w-full max-w-[1200px] mx-auto flex flex-col bg-[#0f172a] p-2.5 items-center">
        <div className="flex items-center justify-between mb-2 w-full">
          <div className="flex items-center">
            <Link to={"/"}>
              <FaFilm className="text-white text-xl mr-2" />
            </Link>
            <div className="search-input relative w-full max-w-[500px] min-w-[800px] flex-grow">
              <div className="flex items-center bg-[#f5f5f5] rounded-full p-1.5 mr-2 flex-grow min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search"
                  className="outline-none border-none bg-transparent px-2 py-1 text-[#333] text-sm w-full"
                  value={Search}
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
            <div className="relative inline-block group">
              <div className="pb-2 mt-2">
                <FaUserCircle className="text-white text-3xl cursor-pointer mr-2" />
              </div>
              {user ? (
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
                    onClick={() => handleLogout()}
                    className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
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

            <Link
              to="/coupons"
              className="coupons inline-block bg-[#d1d5db] min-w-[75px] rounded-full py-1 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
            >
              Ưu đãi
            </Link>
          </div>
        </div>

        <div className="navigation_desktop flex justify-evenly gap-10 w-full mt-2 mb-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            TRANG CHỦ
          </Link>
          <Link
            to="/theaters"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            RẠP PHIM
          </Link>
          {/* <Link
            to="/showtime"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            LỊCH CHIẾU
          </Link> */}
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            LIÊN HỆ
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Header;
