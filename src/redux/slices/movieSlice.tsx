// movieSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateMovieRequest,
  MovieType,
} from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface MovieState {
  listMovie: MovieType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  listMovie: [],
  isLoading: false,
  error: null,
};

export const createMovie = createAsyncThunk(
  "movie/createMovie",
  async (
    { movieData, image }: { movieData: CreateMovieRequest; image: File | null },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      // Create JSON payload for createMovieRequest
      const movieRequest = {
        name: movieData.name,
        premiere: movieData.premiere,
        language: movieData.language,
        duration: movieData.duration,
        content: movieData.content,
        rate: movieData.rate,
        genresId: movieData.genresId,
        directorId: movieData.directorId,
        actorsId: movieData.actorsId,
      };

      // Add JSON payload as a Blob under createMovieRequest key
      formData.append(
        "createMovieRequest",
        new Blob([JSON.stringify(movieRequest)], { type: "application/json" })
      );

      // Add image file under file key if present
      if (image) {
        formData.append("file", image);
      }

      const response = await instance.post("/movies/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create movie"
      );
    }
  }
);

export const getAllMovies = createAsyncThunk(
  "movie/getAllMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/movies/");
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all movies"
      );
    }
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listMovie = action.payload;
      })
      .addCase(getAllMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listMovie.push(action.payload);
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default movieSlice.reducer;
