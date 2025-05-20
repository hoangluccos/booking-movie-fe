import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FoodType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface FoodState {
  listFoods: FoodType[];
  isLoading: boolean;
  error: null | string;
}

const initialState: FoodState = {
  listFoods: [],
  isLoading: false,
  error: null,
};

interface CreateFoodRequest {
  name: string;
  price: number;
}

interface UpdateFoodRequest {
  name: string;
  price: number;
}

export const getAllFoods = createAsyncThunk(
  "food/getAllFoods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/foods/", {});

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all foods"
      );
    }
  }
);

export const createFood = createAsyncThunk(
  "foods/createFood",
  async (
    { foodData, image }: { foodData: CreateFoodRequest; image: File | null },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      // Create JSON payload for createMovieRequest
      const createFoodRequest = {
        name: foodData.name,
        price: foodData.price,
      };

      // Add JSON payload as a Blob under createMovieRequest key
      formData.append(
        "createFoodRequest",
        new Blob([JSON.stringify(createFoodRequest)], {
          type: "application/json",
        })
      );

      // Add image file under file key if present
      if (image) {
        formData.append("file", image);
      }

      const response = await instance.post("/foods/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create coupon"
      );
    }
  }
);

export const updateFood = createAsyncThunk(
  "update/updateFood",
  async (
    {
      foodId,
      foodData,
      image,
    }: {
      foodId: string;
      foodData: UpdateFoodRequest;
      image: File | string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      const updateFoodRequest = {
        name: foodData.name,
        price: foodData.price,
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
        "updateFoodRequest",
        new Blob([JSON.stringify(updateFoodRequest)], {
          type: "application/json",
        })
      );

      // Gửi yêu cầu PUT
      const response = await instance.put(`/foods/${foodId}`, formData, {
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

export const deleteFood = createAsyncThunk(
  "food/deleteFood",
  async ({ foodId }: { foodId: string }, { rejectWithValue }) => {
    try {
      await instance.delete(`/foods/${foodId}`);
      return foodId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete coupon"
      );
    }
  }
);

const FoodSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all food
      .addCase(getAllFoods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllFoods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listFoods = action.payload;
      })
      .addCase(getAllFoods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create food
      .addCase(createFood.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listFoods.push(action.payload);
      })
      .addCase(createFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // update food
      .addCase(updateFood.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFood.fulfilled, (state, action) => {
        state.isLoading = false;
        const updateFood = action.payload;
        const index = state.listFoods.findIndex(
          (foods) => foods.id === updateFood.id
        );
        if (index !== -1) {
          state.listFoods[index] = updateFood;
        }
      })
      .addCase(updateFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete food
      .addCase(deleteFood.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listFoods = state.listFoods.filter(
          (food) => food.id !== action.payload
        );
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default FoodSlice.reducer;
