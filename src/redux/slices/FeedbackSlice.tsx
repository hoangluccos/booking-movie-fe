import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FeedbackType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface FeedbackState {
  listFeedbacks: FeedbackType[];
  isLoading: boolean;
  error: null | string;
}

const initialState: FeedbackState = {
  listFeedbacks: [],
  isLoading: false,
  error: null,
};

export const getAllFeedbacks = createAsyncThunk(
  "feedback/getAllFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/feedbacks/", {});

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  "feedback/deleteFeedback",
  async ({ feedbackId }: { feedbackId: string }, { rejectWithValue }) => {
    try {
      await instance.delete(`/feedbacks/${feedbackId}`, {});

      return feedbackId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  }
);

const FeedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all genre
      .addCase(getAllFeedbacks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listFeedbacks = action.payload;
      })
      .addCase(getAllFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listFeedbacks = state.listFeedbacks.filter(
          (feedback) => feedback.id !== action.payload
        );
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default FeedbackSlice.reducer;
