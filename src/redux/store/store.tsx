// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import movieReducer from "../slices/MovieSlice.tsx";
import userReducer from "../slices/UserSlice.tsx";
import genreReducer from "../slices/GenreSlice.tsx";
import personReducer from "../slices/PersonSlice.tsx";
import theaterReducer from "../slices/TheaterSlice.tsx";
import showtimeReducer from "../slices/ShowtimeSlice.tsx";
import roomReducer from "../slices/RoomSlice.tsx";
import feedbackReducer from "../slices/FeedbackSlice.tsx";
import couponReducer from "../slices/CouponSlice.tsx";
import foodReducer from "../slices/FoodSlice.tsx";
import invoiceReducer from "../slices/InvoiceSlice.tsx";

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
    invoice: invoiceReducer,
  },
});

// Type cho Redux
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

// Custom hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default Store;
