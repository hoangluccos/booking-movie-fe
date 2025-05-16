import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TheaterType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface TheaterState {
  listTheaters: TheaterType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TheaterState = {
  listTheaters: [],
  isLoading: false,
  error: null,
};

export const getAllTheaters = createAsyncThunk(
  "theater/getAllTheaters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/theaters/");

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all theaters"
      );
    }
  }
);

export const createTheater = createAsyncThunk(
  "theater/createTheater",
  async (
    { name, location }: { name: string; location: string },
    { rejectWithValue }
  ) => {
    try {
      const createTheaterRequest = {
        name: name,
        location: location,
      };

      const response = await instance.post(
        "/theaters/",
        createTheaterRequest,
        {}
      );

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

export const updateTheater = createAsyncThunk(
  "theater/updateTheater",
  async (
    {
      theaterId,
      name,
      location,
    }: { theaterId: string; name: string; location: string },
    { rejectWithValue }
  ) => {
    try {
      const updateTheaterRequest = {
        name: name,
        location: location,
      };

      const response = await instance.put(
        `/theaters/${theaterId}`,
        updateTheaterRequest
      );

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

export const deleteTheater = createAsyncThunk(
  "theater/deleteTheater",
  async ({ theaterId }: { theaterId: string }, { rejectWithValue }) => {
    try {
      await instance.delete(`/theaters/${theaterId}`);
      return theaterId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

const TheaterSlice = createSlice({
  name: "theater",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all theater
      .addCase(getAllTheaters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllTheaters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listTheaters = action.payload;
      })
      .addCase(getAllTheaters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create theater
      .addCase(createTheater.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTheater.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listTheaters.push(action.payload);
      })
      .addCase(createTheater.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // update theater
      .addCase(updateTheater.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTheater.fulfilled, (state, action) => {
        state.isLoading = false;
        const updateTheater = action.payload;
        const index = state.listTheaters.findIndex(
          (genre) => genre.id === updateTheater.id
        );
        if (index !== -1) {
          state.listTheaters[index] = updateTheater;
        }
      })
      .addCase(updateTheater.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete genre
      .addCase(deleteTheater.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTheater.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listTheaters = state.listTheaters.filter(
          (genre) => genre.id !== action.payload
        );
      })
      .addCase(deleteTheater.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default TheaterSlice.reducer;
