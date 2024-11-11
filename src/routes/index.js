//pages
import Home from "../pages/HomeUser";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MovieDetail from "../pages/MovieDetail";
import ProfilePage from "../pages/ProfilePage";
import PaymentHistory from "../pages/PaymentHistory";
import NotFound from "../pages/NotFound";
import CouponsPage from "../pages/CouponsPage";

import CommonLayout from "../components/Layout/CommonLayout";

//public
const publicRoutes = [
  {
    path: "*",
    component: NotFound,
  },
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
    path: "/movies/:id",
    component: MovieDetail,
    layout: CommonLayout,
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: CommonLayout,
  },
  {
    path: "/history-payment",
    component: PaymentHistory,
    layout: CommonLayout,
  },
  {
    path: "/coupons",
    component: CouponsPage,
    layout: CommonLayout,
  },
];
//private
export { publicRoutes };
