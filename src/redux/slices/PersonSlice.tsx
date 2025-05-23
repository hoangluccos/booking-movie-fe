import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PersonType } from "../../pages/AdminPages/Data/Data";
import instance from "../../api/instance";

export interface PersonRequest {
  name: string;
  gender: boolean;
  dateOfBirth: string;
}

export type CreatePersonRequest = PersonRequest;
export type UpdatePersonRequest = PersonRequest;

interface PersonState {
  listPerson: PersonType[];
  listActors: PersonType[];
  listDirectors: PersonType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PersonState = {
  listPerson: [],
  listActors: [],
  listDirectors: [],
  isLoading: false,
  error: null,
};

export const getAllPersons = createAsyncThunk(
  "genre/getAllPersons",
  async (_, { rejectWithValue }) => {
    try {
      // Lấy token từ localStorage
      const token = JSON.parse(localStorage.getItem("token") || "null");

      // Kiểm tra nếu không có token
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await instance.get("/persons/", {
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

export const getAllActors = createAsyncThunk(
  "person/getAllActors",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token") || "null");
      if (!token) return rejectWithValue("No token found");

      const response = await instance.get("/persons/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { jobName: "Actor" },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch actors"
      );
    }
  }
);

export const getAllDirectors = createAsyncThunk(
  "person/getAllDirectors",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token") || "null");
      if (!token) return rejectWithValue("No token found");

      const response = await instance.get("/persons/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { jobName: "Director" },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch directors"
      );
    }
  }
);

export const createDirector = createAsyncThunk(
  "person/createDirector",
  async (
    {
      createPersonRequest,
      image,
    }: { createPersonRequest: CreatePersonRequest; image: File | null },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      // Create JSON payload for createMovieRequest
      const params = {
        name: createPersonRequest.name,
        gender: createPersonRequest.gender,
        dateOfBirth: createPersonRequest.dateOfBirth,
      };

      // Add JSON payload as a Blob under createMovieRequest key
      formData.append(
        "createPersonRequest",
        new Blob([JSON.stringify(params)], { type: "application/json" })
      );

      // Add image file under file key if present
      if (image) {
        formData.append("file", image);
      }

      const response = await instance.post("/persons/director", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create director"
      );
    }
  }
);

export const createActor = createAsyncThunk(
  "person/createActor",
  async (
    {
      createPersonRequest,
      image,
    }: { createPersonRequest: CreatePersonRequest; image: File | null },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      // Create JSON payload for createMovieRequest
      const params = {
        name: createPersonRequest.name,
        gender: createPersonRequest.gender,
        dateOfBirth: createPersonRequest.dateOfBirth,
      };

      // Add JSON payload as a Blob under createMovieRequest key
      formData.append(
        "createPersonRequest",
        new Blob([JSON.stringify(params)], { type: "application/json" })
      );

      // Add image file under file key if present
      if (image) {
        formData.append("file", image);
      }

      const response = await instance.post("/persons/actor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create actor"
      );
    }
  }
);

export const updatePerson = createAsyncThunk(
  "person/updatePerson",
  async (
    {
      personId,
      updatePersonRequest,
      image,
    }: {
      personId: string;
      updatePersonRequest: UpdatePersonRequest;
      image: File | string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      const params = {
        name: updatePersonRequest.name,
        gender: updatePersonRequest.gender,
        dateOfBirth: updatePersonRequest.dateOfBirth,
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
      formData.append("personId", personId);

      formData.append(
        "updatePersonRequest",
        new Blob([JSON.stringify(params)], { type: "application/json" })
      );

      // Gửi yêu cầu PUT
      const response = await instance.put("/persons/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update person"
      );
    }
  }
);

export const deletePerson = createAsyncThunk(
  "movie/deletePerson",
  async ({ personId }: { personId: string }, { rejectWithValue }) => {
    try {
      await instance.delete(`/persons/${personId}`);
      return personId; //movieId = action.payload trả về cho Slice sử dụng
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete person"
      );
    }
  }
);

const PersonSlice = createSlice({
  name: "person",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all person
      .addCase(getAllPersons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPersons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listPerson = action.payload;
      })
      .addCase(getAllPersons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // get all actor
      .addCase(getAllActors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllActors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listActors = action.payload;
      })
      .addCase(getAllActors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // get all director
      .addCase(getAllDirectors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDirectors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listDirectors = action.payload;
      })
      .addCase(getAllDirectors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create director
      .addCase(createDirector.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDirector.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listPerson.push(action.payload);
      })
      .addCase(createDirector.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create actor
      .addCase(createActor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createActor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listPerson.push(action.payload);
      })
      .addCase(createActor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // update person
      .addCase(updatePerson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatePerson = action.payload;
        const index = state.listPerson.findIndex(
          (movie) => movie.id === updatePerson.id
        );
        if (index !== -1) {
          state.listPerson[index] = updatePerson;
        }
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // delete person
      .addCase(deletePerson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listPerson = state.listPerson.filter(
          (person) => person.id !== action.payload
        );
      })
      .addCase(deletePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default PersonSlice.reducer;
