import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface MovieState {
  listUser: UserType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  listUser: [],
  isLoading: false,
  error: null,
};

export const getAllUsers = createAsyncThunk(
  "user/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      // Lấy token từ localStorage
      const token = JSON.parse(localStorage.getItem("token") || "null");

      // Kiểm tra nếu không có token
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await instance.get("/users/", {
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

export const updateStatus = createAsyncThunk(
  "user/updateStatus",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token") || "null");

      if (!token) {
        return rejectWithValue("No token found");
      }

      await instance.put(
        `/users/ban/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all movie
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listUser = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // update movie
      .addCase(updateStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const userId = action.payload;
        // update status
        state.listUser = state.listUser.map((user) =>
          user.id === userId ? { ...user, status: !user.status } : user
        );
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default UserSlice.reducer;
