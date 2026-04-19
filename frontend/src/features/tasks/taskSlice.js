import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/tasks", { params: { page, limit, search } });
      return res.data; // { tasks, total, page, limit, totalPages }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);

export const getTaskById = createAsyncThunk(
  "tasks/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks/${id}`);
      return res.data; // task object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch task",
      );
    }
  },
);

export const addtask = createAsyncThunk(
  "tasks/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks", data);
      return res.data; // created task object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add task",
      );
    }
  },
);

export const updatetask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data; // updated task object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update task",
      );
    }
  },
);

export const deletetask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

// ── Slice ────────────────────────────────────────────────────────────────────

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    currentTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    };

    builder
      // fetch tasks (paginated)
      .addCase(fetchTasks.pending, pending)
      .addCase(fetchTasks.rejected, rejected)
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload.tasks;
        state.total = payload.total;
        state.totalPages = payload.totalPages;
        state.currentPage = payload.page;
      })
      // get by id (for edit prefill)
      .addCase(getTaskById.pending, pending)
      .addCase(getTaskById.rejected, rejected)
      .addCase(getTaskById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentTask = payload;
      })
      // add task — component redirects, listing page refetches
      .addCase(addtask.pending, pending)
      .addCase(addtask.rejected, rejected)
      .addCase(addtask.fulfilled, (state) => {
        state.loading = false;
      })
      // update task — component redirects, listing page refetches
      .addCase(updatetask.pending, pending)
      .addCase(updatetask.rejected, rejected)
      .addCase(updatetask.fulfilled, (state, { payload }) => {
        state.loading = false;
        // update in-place so inline status change reflects immediately
        const idx = state.tasks.findIndex((t) => t._id === payload._id);
        if (idx !== -1) state.tasks[idx] = payload;
        if (state.currentTask?._id === payload._id) state.currentTask = payload;
      })
      // delete task
      .addCase(deletetask.pending, pending)
      .addCase(deletetask.rejected, rejected)
      .addCase(deletetask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t._id !== payload);
        if (state.total > 0) state.total -= 1;
      });
  },
});

export const { clearError, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
