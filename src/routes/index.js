//pages
import Home from "../pages/HomeUser";
import Login from "../pages/Login";
import MovieDetail from "../pages/MovieDetail";
import ProfilePage from "../pages/ProfilePage";
import PaymentHistory from "../pages/PaymentHistory";
import NotFound from "../pages/NotFound";
import CouponsPage from "../pages/CouponsPage";
import HomeAdmin from "../pages/AdminPages/HomeAdmin";
import Users from "../pages/AdminPages/Users";
import SeatSelection from "../pages/SeatSelection";
import PaymentMethods from "../pages/PaymentMethods";
import PaymentCallback from "../pages/PaymentCallback";
import RegistrationFlow from "../pages/RegistrationFlow";
import MovieForm from "../pages/AdminPages/MovieForm";

import CommonLayout from "../components/Layout/CommonLayout";
import NotSlider from "../components/Layout/NotSlider";
import AdminLayout from "../components/Layout/AdminLayout";

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
    component: RegistrationFlow,
  },
  {
    path: "/movies/:id",
    component: MovieDetail,
    layout: NotSlider,
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: NotSlider,
  },
  {
    path: "/history-payment",
    component: PaymentHistory,
    layout: NotSlider,
  },
  {
    path: "/coupons",
    component: CouponsPage,
    layout: NotSlider,
  },
  {
    path: "/showtime/:id/seat-selection",
    component: SeatSelection,
    layout: NotSlider,
  },
  {
    path: "/paymentMethod/:showtimeId",
    component: PaymentMethods,
    layout: NotSlider,
  },
  {
    path: "/payment-status",
    component: PaymentCallback,
    layout: NotSlider,
  },
];
//private
const privateRoutes = [
  {
    path: "/admin/movies",
    component: HomeAdmin,
    layout: AdminLayout,
  },
  {
    path: "/admin/users",
    component: Users,
    layout: AdminLayout,
  },
  {
    path: "/admin/add-movie",
    component: MovieForm,
    layout: AdminLayout,
  },
  {
    path: "/admin/edit-movie/:id",
    component: MovieForm,
    layout: AdminLayout,
  },
];
export { publicRoutes, privateRoutes };
