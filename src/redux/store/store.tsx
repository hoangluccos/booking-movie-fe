// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import movieReducer from "../Slices/MovieSlice.tsx";
import userReducer from "../Slices/UserSlice.tsx";
import genreReducer from "../Slices/GenreSlice.tsx";
import personReducer from "../Slices/PersonSlice.tsx";
import theaterReducer from "../Slices/TheaterSlice.tsx";
import showtimeReducer from "../Slices/ShowtimeSlice.tsx";
import roomReducer from "../Slices/RoomSlice.tsx";
import feedbackReducer from "../Slices/FeedbackSlice.tsx";
import couponReducer from "../Slices/CouponSlice.tsx";
import foodReducer from "../Slices/FoodSlice.tsx";

const Store = configureStore({
  reducer: {
    movie: movieReducer,
    user: userReducer,
    genre: genreReducer,
    person: personReducer,
    theater: theaterReducer,
    showtime: showtimeReducer,
    room: roomReducer,
    feedback: feedbackReducer,
    coupon: couponReducer,
    food: foodReducer,
  },
});

// Type cho Redux
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

// Custom hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default Store;
