import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

      return response.data.result.ticketDetails;
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
  reducers: {
    sortInvoiceByTime: (state, action: PayloadAction<0 | 1>) => {
      state.listInvoices = [...state.listInvoices].sort((a, b) => {
        // Chuyển đổi date từ "DD-MM-YYYY" sang "YYYY-MM-DD"
        const toISOString = (d: string) => {
          const [day, month, year] = d.split("-");
          return `${year}-${month}-${day}`;
        };

        const timeA = new Date(`${toISOString(a.date)}T${a.time}`).getTime();
        const timeB = new Date(`${toISOString(b.date)}T${b.time}`).getTime();

        return action.payload === 0 ? timeA - timeB : timeB - timeA;
      });
    },
  },
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
export const { sortInvoiceByTime } = InvoiceSlice.actions;
