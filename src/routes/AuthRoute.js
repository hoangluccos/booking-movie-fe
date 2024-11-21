import React, { useEffect, useState } from "react";
import instance from "../api/instance";
import { Navigate, Outlet } from "react-router-dom";
function AuthRoute() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [auth, setAuth] = useState(null);
  console.log(auth);
  useEffect(() => {
    (async () => {
      try {
        const res = await instance.post("/auth/introspect", token);
        // console.log(res.data.result.role);
        setAuth(res.data.result.role);
      } catch (error) {
        console.log(error);
        setAuth("");
      }
    })();
  }, []);
  // Khi auth chưa được thiết lập, hiển thị trạng thái chờ.
  if (auth === null) return <div>Loading...</div>;
  return auth === "MANAGER" || auth === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

export default AuthRoute;
