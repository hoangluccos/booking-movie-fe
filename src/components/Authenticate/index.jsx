import { useEffect } from "react";
import instance from "../../api/instance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Authenticate() {
  const nav = useNavigate();
  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];
      const fetch = async () => {
        try {
          const res = await instance.post(
            `auth/outbound/authentication?code=${authCode}`
          );
          console.log(res.data);
          if (res.data.code === 200) {
            const token = res.data.result.token;
            // localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", JSON.stringify(res.data.result));
            console.log(JSON.stringify(res.data.result.token));
            toast.success("Bạn đã đăng nhập thành công!");
            setTimeout(() => {
              nav("/");
            }, 1000);
          }
        } catch (error) {
          console.log("Error fetch login gg: ", error);
        }
      };
      fetch();
    }
  }, []);

  return (
    <>
      {/* <ToastContainer /> */}
      <p className="flex flex-col gap-[30px] justify-center items-center h-[100vh]">
        <p>Authenticating...</p>
      </p>
    </>
  );
}
