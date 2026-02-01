import axios from 'axios'
import { toast } from 'react-toastify'
const API_URL = 'http://localhost:8000/task/'

// Create new task
const createTask = async (taskData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.post(API_URL, taskData, config)
  
    return response.data
  } catch (err) {
  // Check if err.response exists before reading its status
  const message = err.response?.data?.detail || err.message || "Something went wrong";
  toast.error(message);
  throw err; // Always re-throw for Redux Toolkit to catch the rejection
}
}

// Get user tasks
const getTasks = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.get(API_URL, config)
    return response.data
 } catch (err) {
  // Check if err.response exists before reading its status
  const message = err.response?.data?.detail || err.message || "Something went wrong";
  toast.error(message);
  throw err; // Always re-throw for Redux Toolkit to catch the rejection
}
}

// Get single Task
const getTask = async (taskId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  
    const response = await axios.get(API_URL + taskId, config)
  
    return response.data
 } catch (err) {
  // Check if err.response exists before reading its status
  const message = err.response?.data?.detail || err.message || "Something went wrong";
  toast.error(message);
  throw err; // Always re-throw for Redux Toolkit to catch the rejection
}
}

// Update Task
const updateTask = async (data, token) => {
 try {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // Extract the ID from the data payload
  const response = await axios.patch(API_URL + data.id, data, config)

  return response.data
} catch (err) {
  // Check if err.response exists before reading its status
  const message = err.response?.data?.detail || err.message || "Something went wrong";
  toast.error(message);
  throw err; // Always re-throw for Redux Toolkit to catch the rejection
}
}

// Delete single Task
const deleteTask = async (taskId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  
    const response = await axios.delete(API_URL + taskId, config)
  
    return response.data
 } catch (err) {
  // Check if err.response exists before reading its status
  const message = err.response?.data?.detail || err.message || "Something went wrong";
  toast.error(message);
  throw err; // Always re-throw for Redux Toolkit to catch the rejection
}
}

const taskService = {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTasks,
}

export default taskService
