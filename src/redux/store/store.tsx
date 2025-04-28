// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import movieReducer from "../slices/movieSlice.tsx"; //

const Store = configureStore({
  reducer: {
    movie: movieReducer, // 👈 phải truyền vào đúng reducer
  },
});

// Type cho Redux
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

// Custom hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default Store;
