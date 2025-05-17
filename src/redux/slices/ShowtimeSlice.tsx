import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ShowtimeType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface ShowtimeState {
  listShowtimes: ShowtimeType[];
  showtimeInfo: ShowtimeType | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShowtimeState = {
  listShowtimes: [],
  showtimeInfo: null,
  isLoading: false,
  error: null,
};

interface CreateShowtimeRequest {
  date: string;
  startTime: string;
  movieId: string;
  roomId: string;
}

interface UpdateShowtimeRequest {
  startTime: string;
  date: string;
  roomId: string;
}

export const getAllShowtimes = createAsyncThunk(
  "showtime/getAllShowtimes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/showtimes/");

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all theaters"
      );
    }
  }
);

export const getOneShowtime = createAsyncThunk(
  "showtime/getOneShowtime",
  async ({ showtimeId }: { showtimeId: string }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`showtimes/info/${showtimeId}`);

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all theaters"
      );
    }
  }
);

export const createShowtime = createAsyncThunk(
  "showtime/createShowtime",
  async (
    { createShowtimeRequest }: { createShowtimeRequest: CreateShowtimeRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        "/showtimes/",
        createShowtimeRequest,
        {}
      );

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create showtime"
      );
    }
  }
);

export const updateShowtime = createAsyncThunk(
  "showtime/updateShowtime",
  async (
    {
      showtimeId,
      updateShowtimeRequest,
    }: { showtimeId: string; updateShowtimeRequest: UpdateShowtimeRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.put(
        `/showtimes/${showtimeId}`,
        updateShowtimeRequest
      );

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update showtime"
      );
    }
  }
);

export const deleteShowtime = createAsyncThunk(
  "showtime/deleteShowtime",
  async ({ showtimeId }: { showtimeId: string }, { rejectWithValue }) => {
    try {
      await instance.delete(`/showtimes/${showtimeId}`);
      return showtimeId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete showtime"
      );
    }
  }
);

const ShowtimeSlice = createSlice({
  name: "showtime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all showtime
      .addCase(getAllShowtimes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllShowtimes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listShowtimes = action.payload;
      })
      .addCase(getAllShowtimes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // get one showtime
      .addCase(getOneShowtime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOneShowtime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showtimeInfo = action.payload;
      })
      .addCase(getOneShowtime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create showtime
      .addCase(createShowtime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createShowtime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listShowtimes.push(action.payload);
      })
      .addCase(createShowtime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // update theater
      .addCase(updateShowtime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateShowtime.fulfilled, (state, action) => {
        state.isLoading = false;
        const updateShowtime = action.payload;
        const index = state.listShowtimes.findIndex(
          (genre) => genre.id === updateShowtime.id
        );
        if (index !== -1) {
          state.listShowtimes[index] = updateShowtime;
        }
      })
      .addCase(updateShowtime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete genre
      .addCase(deleteShowtime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteShowtime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listShowtimes = state.listShowtimes.filter(
          (genre) => genre.id !== action.payload
        );
      })
      .addCase(deleteShowtime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default ShowtimeSlice.reducer;
