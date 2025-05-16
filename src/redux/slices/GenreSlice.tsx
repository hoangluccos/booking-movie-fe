import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenreType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface GenreState {
  listGenre: GenreType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GenreState = {
  listGenre: [],
  isLoading: false,
  error: null,
};

export const getAllGenres = createAsyncThunk(
  "genre/getAllGenres",
  async (_, { rejectWithValue }) => {
    try {
      // Lấy token từ localStorage
      const token = JSON.parse(localStorage.getItem("token") || "null");

      // Kiểm tra nếu không có token
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await instance.get("/genres/", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);

export const createGenre = createAsyncThunk(
  "genre/createGenre",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      // Lấy token từ localStorage
      const token = JSON.parse(localStorage.getItem("token") || "null");

      // Kiểm tra nếu không có token
      if (!token) {
        return rejectWithValue("No token found");
      }

      const createGenreRequest = {
        name: name,
      };

      const response = await instance.post("/genres/", createGenreRequest, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

export const updateGenre = createAsyncThunk(
  "genre/updateGenre",
  async (
    { genreId, name }: { genreId: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      // Lấy token từ localStorage
      const token = JSON.parse(localStorage.getItem("token") || "null");

      // Kiểm tra nếu không có token
      if (!token) {
        return rejectWithValue("No token found");
      }

      const updateGenreRequest = {
        name: name,
      };

      const response = await instance.put(
        `/genres/${genreId}`,
        updateGenreRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

export const deleteGenre = createAsyncThunk(
  "genre/deleteGenre",
  async ({ genreId }: { genreId: string }, { rejectWithValue }) => {
    try {
      // Lấy token từ localStorage
      const token = JSON.parse(localStorage.getItem("token") || "null");

      // Kiểm tra nếu không có token
      if (!token) {
        return rejectWithValue("No token found");
      }

      await instance.delete(`/genres/${genreId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      return genreId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

const GenreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all genre
      .addCase(getAllGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllGenres.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listGenre = action.payload;
      })
      .addCase(getAllGenres.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create genre
      .addCase(createGenre.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listGenre.push(action.payload);
      })
      .addCase(createGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // update genre
      .addCase(updateGenre.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGenre.fulfilled, (state, action) => {
        state.isLoading = false;
        const updateGenre = action.payload;
        const index = state.listGenre.findIndex(
          (genre) => genre.id === updateGenre.id
        );
        if (index !== -1) {
          state.listGenre[index] = updateGenre;
        }
      })
      .addCase(updateGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete genre
      .addCase(deleteGenre.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGenre.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listGenre = state.listGenre.filter(
          (genre) => genre.id !== action.payload
        );
      })
      .addCase(deleteGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default GenreSlice.reducer;
