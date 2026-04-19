import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/tasks");
      return res.data;
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
      return res.data;
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
      return res.data.data;
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
      return res.data.data;
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

// ── Helpers ──────────────────────────────────────────────────────────────────

const persist = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const clear = () => {
  localStorage.removeItem("tasks");
};

const storedTasks = localStorage.getItem("tasks");

// ── Slice ────────────────────────────────────────────────────────────────────

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: storedTasks ? JSON.parse(storedTasks) : [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
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

    const setItems = (state, { payload }) => {
      state.loading = false;
      state.tasks = payload;
      persist(payload);
    };

    builder
      // fetch tasks
      .addCase(fetchTasks.pending, pending)
      .addCase(fetchTasks.rejected, rejected)
      .addCase(fetchTasks.fulfilled, setItems)
      // add task
      .addCase(addtask.pending, pending)
      .addCase(addtask.rejected, rejected)
      .addCase(addtask.fulfilled, setItems)
      // update task
      .addCase(updatetask.pending, pending)
      .addCase(updatetask.rejected, rejected)
      .addCase(updatetask.fulfilled, setItems)
      // delete task
      .addCase(deletetask.pending, pending)
      .addCase(deletetask.rejected, rejected)
      .addCase(deletetask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== payload);
        persist(state.tasks);
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
