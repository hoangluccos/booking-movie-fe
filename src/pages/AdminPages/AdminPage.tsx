import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./Dashboard/DashboardPage.tsx";
import LayoutAdminPage from "./LayoutAdminPage.tsx";
import MoviePage from "./MoviePage/MoviePage.tsx";
import UserPage from "./Users/UserPage.tsx";
import GenrePage from "./GenrePage/GenrePage.tsx";
import PersonPage from "./PersonPage/PersonPage.tsx";
import TheaterPage from "./TheaterManagement/TheaterPage.tsx";
import FeedbackPage from "./FeedbacksManagement/FeedbackPage.tsx";
import CreateUpdateMoviePage from "./MoviePage/CreateUpdateMoviePage.tsx";
import CreateUpdatePersonPage from "./PersonPage/CreateUpdatePersonPage.tsx";
import ShowtimePage from "./ShowTimePage/ShowtimePage.tsx";
import CreateUpdateShowtimePage from "./ShowTimePage/CreateUpdateShowtimePage.tsx";
import RoomPage from "./RoomPage/RoomPage.tsx";
import CreateRoomPage from "./RoomPage/CreateRoomPage.tsx";
import CouponPage from "./CouponPage/CouponPage.tsx";
import FoodPage from "./FoodPage/FoodPage.tsx";
import CreateUpdateCouponPage from "./CouponPage/CreateUpdateCouponPage.tsx";
import InvoicePage from "./InvoicePage/InvoicePage.tsx";
import InvoiceDetailPage from "./InvoicePage/InvoiceDetailPage.tsx";

const AdminPage = () => {
  return (
    <Routes>
      {/* layout cho trang admin */}
      <Route element={<LayoutAdminPage />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/movies" element={<MoviePage />} />
        <Route path="/movies/create" element={<CreateUpdateMoviePage />} />
        <Route path="/movies/edit/:id" element={<CreateUpdateMoviePage />} />

        <Route path="/showtimes" element={<ShowtimePage />} />
        <Route
          path="/showtimes/create"
          element={<CreateUpdateShowtimePage />}
        />
        <Route
          path="/showtimes/edit/:id"
          element={<CreateUpdateShowtimePage />}
        />

        <Route path="/invoices" element={<InvoicePage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />

        <Route path="/users" element={<UserPage />} />

        <Route path="/genres" element={<GenrePage />} />

        <Route path="/persons" element={<PersonPage />} />
        <Route path="/persons/create" element={<CreateUpdatePersonPage />} />
        <Route path="/persons/edit/:id" element={<CreateUpdatePersonPage />} />

        <Route path="/theaters" element={<TheaterPage />} />
        <Route path="/theaters/:id" element={<RoomPage />} />
        <Route path="/theaters/:id/create" element={<CreateRoomPage />} />

        <Route path="/rooms" element={<RoomPage />} />

        <Route path="/coupons" element={<CouponPage />} />
        <Route path="/coupons/create" element={<CreateUpdateCouponPage />} />
        <Route path="/coupons/edit/:id" element={<CreateUpdateCouponPage />} />

        <Route path="/foods" element={<FoodPage />} />

        <Route path="/feedbacks" element={<FeedbackPage />} />
      </Route>
    </Routes>
  );
};

export default AdminPage;
