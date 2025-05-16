import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RoomType, ShowimeType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface RoomState {
  listRooms: RoomType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  listRooms: [],
  isLoading: false,
  error: null,
};

export const getAllRooms = createAsyncThunk(
  "room/getAllRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/rooms/getAll");

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all theaters"
      );
    }
  }
);

const RoomSlice = createSlice({
  name: "showtime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all genre
      .addCase(getAllRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRooms = action.payload;
      })
      .addCase(getAllRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default RoomSlice.reducer;
