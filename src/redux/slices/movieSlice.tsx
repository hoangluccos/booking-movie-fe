// movieSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GenreType,
  MovieType,
  PersonType,
} from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

export interface CreateMovieRequest {
  name: string;
  content: string;
  premiere: string;
  duration: number;
  language: string;
  rate: number;
  genresId: string[];
  directorId: string;
  actorsId: string[];
}

export interface MovieDetailResponse {
  id: string;
  name: string;
  premiere: string;
  language: string;
  content: string;
  duration: number;
  rate: number;
  image: string;
  canComment: boolean;
  genres: GenreType[];
  director: PersonType;
  actors: PersonType[];
}

interface MovieState {
  listMovie: MovieType[];
  movieDetail: MovieDetailResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  listMovie: [],
  movieDetail: null,
  isLoading: false,
  error: null,
};

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

export const getDetailMovie = createAsyncThunk(
  "movie/getDatailMovie",
  async ({ movieId }: { movieId: string }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/movies/${movieId}`);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all movies"
      );
    }
  }
);

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

export const updateMovie = createAsyncThunk(
  "movie/updateMovie",
  async (
    {
      movieId,
      movieData,
      image,
    }: {
      movieId: string;
      movieData: CreateMovieRequest;
      image: File | string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

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

      // Xử lý image
      if (image) {
        if (typeof image === "string") {
          // Tải file từ URL
          try {
            const response = await fetch(image, { mode: "cors" });
            if (!response.ok) {
              throw new Error("Failed to fetch image from URL");
            }
            const blob = await response.blob();
            const file = new File([blob], "image.jpg", { type: blob.type });
            formData.append("file", file);
          } catch (fetchError) {
            return rejectWithValue("Failed to fetch image from URL");
          }
        } else {
          // image là File
          formData.append("file", image);
        }
      } else {
        // Nếu image là null, trả lỗi vì API yêu cầu file
        return rejectWithValue("Image file is required");
      }

      // Append JSON data
      formData.append(
        "updateMovieRequest",
        new Blob([JSON.stringify(movieRequest)], { type: "application/json" })
      );

      // Gửi yêu cầu PUT
      const response = await instance.put(`/movies/${movieId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update movie"
      );
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movie/deleteMovie",
  async (movieId: string, { rejectWithValue }) => {
    try {
      await instance.delete(`/movies/${movieId}`);
      return movieId; //movieId = action.payload trả về cho Slice sử dụng
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete movie"
      );
    }
  }
);

const MovieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all movie
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

      // get detail movie
      .addCase(getDetailMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDetailMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movieDetail = action.payload;
      })
      .addCase(getDetailMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create movie
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
      })

      // update movie
      .addCase(updateMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedMovie = action.payload;
        const index = state.listMovie.findIndex(
          (movie) => movie.id === updatedMovie.id
        );
        if (index !== -1) {
          state.listMovie[index] = updatedMovie;
        }
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete movie
      .addCase(deleteMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listMovie = state.listMovie.filter(
          (movie) => movie.id !== action.payload
        );
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
//update name MovieSlice
export default MovieSlice.reducer;
