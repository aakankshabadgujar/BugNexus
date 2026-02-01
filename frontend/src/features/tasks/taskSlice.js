import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "./taskService";

const initialState = {
  tasks: [],
  task: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new task
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await taskService.createTask(taskData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Multiple Tasks
export const getTasks = createAsyncThunk(
  "tasks/getTask",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await taskService.getTasks(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Get single task
export const getTask = createAsyncThunk(
  'tasks/get',
  async (taskId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await taskService.getTask(taskId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update single task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async (taskData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await taskService.updateTask(taskData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await taskService.deleteTask(taskId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetVariables: (state) => {
      state.isError = false
      state.isLoading = false
      state.isSuccess = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
  state.isLoading = false;
  // Only keep tasks that have a valid numeric ID
  state.tasks = action.payload.filter(t => t && t.id); 
})
      
     
    
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
     // Add a filter to the fulfilled cases to remove any 'null' or 'undefined' tasks

      // REPLACE your updateTask.fulfilled block with this specific logic:
    // REPLACE your current updateTask.fulfilled block with this:
.addCase(updateTask.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  // 1. Update the single 'task' for the detail page
  state.task = action.payload; 
  
  // 2. Update ONLY the specific task in the list array 
  // This prevents other tasks from becoming 'undefined' and stops the 'reading id' crash.
  state.tasks = state.tasks.map((task) =>
    task.id === action.payload.id ? action.payload : task
  );
})

      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        getTasks()
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetVariables } = taskSlice.actions;
export default taskSlice.reducer;
