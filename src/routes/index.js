//pages
import Home from "../pages/HomeUser";
import Login from "../pages/Login";
import MovieDetail from "../pages/MovieDetail";
import ProfilePage from "../pages/ProfilePage";
import PaymentHistory from "../pages/PaymentHistory";
import NotFound from "../pages/NotFound";
import CouponsPage from "../pages/CouponsPage";
import TheatersPage from "../pages/TheatersPage";
import ContactPage from "../pages/ContactPage";
import HomeAdmin from "../pages/AdminPages/HomeAdmin";
import Users from "../pages/AdminPages/Users";
import SeatSelection from "../pages/SeatSelection";
import PaymentMethods from "../pages/PaymentMethods";
import PaymentCallback from "../pages/PaymentCallback";
import RegistrationFlow from "../pages/RegistrationFlow";
import MovieForm from "../pages/AdminPages/MovieForm";
import Dashboard from "../pages/AdminPages/Dashboard";
import GenrePage from "../pages/AdminPages/GenrePage";
import ActorPage from "../pages/AdminPages/ActorPage";
import TheaterManagement from "../pages/AdminPages/TheaterManagement";
import DirectorPage from "../pages/AdminPages/DirectorPage";
import ShowTimePage from "../pages/AdminPages/ShowTimePage";
import SearchPage from "../pages/SearchPage";

import CommonLayout from "../components/Layout/CommonLayout";
import NotSlider from "../components/Layout/NotSlider";
import AdminLayout from "../components/Layout/AdminLayout";
import FeedbacksManagement from "../pages/AdminPages/FeedbacksManagement";
import MatchingPage from "../pages/MatchingPage";
import MatchingSuccess from "../pages/MatchingSuccess";
import PersonPage from "../pages/PersonPage";
import GenreMoviePage from "../pages/GenreMoviePage";

// Admin
import AdminPage from "../pages/AdminPages/AdminPage.tsx";

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
    path: "/forget-password",
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
    path: "/theaters",
    component: TheatersPage,
    layout: NotSlider,
  },
  {
    path: "/contact",
    component: ContactPage,
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
  {
    path: "/search",
    component: SearchPage,
    layout: NotSlider,
  },
  {
    path: "/matching",
    component: MatchingPage,
    layout: NotSlider,
  },
  {
    path: "/matching_success",
    component: MatchingSuccess,
    layout: NotSlider,
  },
  {
    path: "/person_page/:id",
    component: PersonPage,
    layout: NotSlider,
  },
  {
    path: "/genre_page/:id",
    component: GenreMoviePage,
    layout: NotSlider,
  },
];
//private
const privateRoutes = [
  {
    path: "/admin/*",
    component: AdminPage,
  },
  // {
  //   path: "/admin",
  //   component: Dashboard,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/movies",
  //   component: HomeAdmin,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/showtime/:id",
  //   component: ShowTimePage,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/users",
  //   component: Users,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/add-movie",
  //   component: MovieForm,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/edit-movie/:id",
  //   component: MovieForm,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/genres",
  //   component: GenrePage,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/actors",
  //   component: ActorPage,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/directors",
  //   component: DirectorPage,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/theaters",
  //   component: TheaterManagement,
  //   layout: AdminLayout,
  // },
  // {
  //   path: "/admin/feedbacks",
  //   component: FeedbacksManagement,
  //   layout: AdminLayout,
  // },
];
export { publicRoutes, privateRoutes };
