//pages
import Home from "../pages/HomeUser";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CommonLayout from "../components/Layout/CommonLayout";

//public
const publicRoutes = [
  {
    path: "/",
    component: Home,
    layout: CommonLayout,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/logout",
    component: Home,
    layout: CommonLayout,
  },
];
//private
export { publicRoutes };
