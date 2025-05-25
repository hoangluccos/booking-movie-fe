import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  InvoiceDetailType,
  InvoiceType,
} from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

interface InvoiceState {
  listInvoices: InvoiceType[];
  listInvoiceDetails: InvoiceDetailType[];
  isLoading: boolean;
  error: null | string;
}

const initialState: InvoiceState = {
  listInvoices: [],
  listInvoiceDetails: [],
  isLoading: false,
  error: null,
};

export const getAllInvoices = createAsyncThunk(
  "invoice/getAllInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/book/ticket", {});
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);

export const getAllInvoiceDetails = createAsyncThunk(
  "invoice/getAllInvoiceDetails",
  async ({ ticketId }: { ticketId: string }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/book/ticket/${ticketId}`, {});

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);

const InvoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all invoice
      .addCase(getAllInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listInvoices = action.payload;
        console.log("Redux updated listInvoices:", action.payload);
      })
      .addCase(getAllInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // get all invoice details
      .addCase(getAllInvoiceDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllInvoiceDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listInvoiceDetails = action.payload;
      })
      .addCase(getAllInvoiceDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default InvoiceSlice.reducer;
