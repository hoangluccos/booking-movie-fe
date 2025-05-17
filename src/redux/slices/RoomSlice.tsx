import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RoomType } from "../../pages/AdminPages/Data/Data";
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

interface CreateRoomRequest {
  name: string;
  rows: number;
  columns: number;
  coupleRows: [];
}

export const getAllRooms = createAsyncThunk(
  "room/getAllRooms",
  async ({ theaterId }: { theaterId: string }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/rooms/getAll/${theaterId}`);

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all room"
      );
    }
  }
);

export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (
    {
      theaterId,
      createRoomRequest,
    }: { theaterId: string; createRoomRequest: CreateRoomRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `/theaters/${theaterId}/rooms`,
        createRoomRequest,
        {}
      );

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create room"
      );
    }
  }
);

export const deleteRoom = createAsyncThunk(
  "room/deleteRoom",
  async (
    { theaterId, roomId }: { theaterId: string; roomId: string },
    { rejectWithValue }
  ) => {
    try {
      await instance.delete(`/theaters/${theaterId}/rooms/${roomId}`);
      return roomId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

const RoomSlice = createSlice({
  name: "room",
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
      })

      // create showtime
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete room
      .addCase(deleteRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRooms = state.listRooms.filter(
          (room) => room.id !== action.payload
        );
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default RoomSlice.reducer;
