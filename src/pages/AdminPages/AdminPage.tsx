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
import MovieCreatePage from "./MoviePage/CreateMoviePage.tsx";

const AdminPage = () => {
  return (
    <Routes>
      {/* layout cho trang admin */}
      <Route element={<LayoutAdminPage />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/movies" element={<MoviePage />} />
        <Route path="movies/create" element={<MovieCreatePage />} />

        <Route path="/users" element={<UserPage />} />

        <Route path="/genres" element={<GenrePage />} />

        <Route path="/persons" element={<PersonPage />} />

        <Route path="/theaters" element={<TheaterPage />} />

        <Route path="/feedbacks" element={<FeedbackPage />} />
      </Route>
    </Routes>
  );
};

export default AdminPage;
