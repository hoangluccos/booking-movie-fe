import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CouponType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface CouponState {
  listCoupons: CouponType[];
  isLoading: boolean;
  error: null | string;
}

const initialState: CouponState = {
  listCoupons: [],
  isLoading: false,
  error: null,
};

export interface CreateCouponRequest {
  code: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  minValue: number;
  description: string;
}

export interface UpdateCouponRequest {
  code: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  minValue: number;
  description: string;
}

export const getAllCoupons = createAsyncThunk(
  "coupon/getAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/coupons/", {});

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all coupons"
      );
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (
    {
      couponData,
      image,
    }: { couponData: CreateCouponRequest; image: File | null },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      // Create JSON payload for createMovieRequest
      const createCouponRequest = {
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        startDate: couponData.startDate,
        endDate: couponData.endDate,
        minValue: couponData.minValue,
        description: couponData.description,
      };

      // Add JSON payload as a Blob under createMovieRequest key
      formData.append(
        "createCouponRequest",
        new Blob([JSON.stringify(createCouponRequest)], {
          type: "application/json",
        })
      );

      // Add image file under file key if present
      if (image) {
        formData.append("file", image);
      }

      const response = await instance.post("/coupons/", formData, {
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

export const toggleCouponStatus = createAsyncThunk(
  "coupon/toggleCouponStatus",
  async ({ couponId }: { couponId: string }, { rejectWithValue }) => {
    try {
      await instance.put(`/coupons/toggle/${couponId}`, {});

      return couponId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async (
    {
      couponId,
      couponData,
      image,
    }: {
      couponId: string;
      couponData: UpdateCouponRequest;
      image: File | string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      const updateCouponRequest = {
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        startDate: couponData.startDate,
        endDate: couponData.endDate,
        minValue: couponData.minValue,
        description: couponData.description,
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
        "updateCouponRequest",
        new Blob([JSON.stringify(updateCouponRequest)], {
          type: "application/json",
        })
      );

      // Gửi yêu cầu PUT
      const response = await instance.put(`/coupons/${couponId}`, formData, {
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

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async ({ couponId }: { couponId: string }, { rejectWithValue }) => {
    try {
      await instance.delete(`/coupons/${couponId}`);
      return couponId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete coupon"
      );
    }
  }
);

const CouponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all coupon
      .addCase(getAllCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listCoupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create coupon
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listCoupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // toggle status
      .addCase(toggleCouponStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.listCoupons.findIndex(
          (coupon) => coupon.id === action.payload
        );
        if (index !== -1) {
          state.listCoupons[index].status =
            state.listCoupons[index].status === true ? false : true;
        }
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        const updateCoupon = action.payload;
        const index = state.listCoupons.findIndex(
          (coupon) => coupon.id === updateCoupon.id
        );
        if (index !== -1) {
          state.listCoupons[index] = updateCoupon;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete movie
      .addCase(deleteCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listCoupons = state.listCoupons.filter(
          (coupon) => coupon.id !== action.payload
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default CouponSlice.reducer;
