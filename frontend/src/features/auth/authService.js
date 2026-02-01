import axios from "axios";
import { toast } from "react-toastify";
const API_URL = "http://127.0.0.1:8000/auth/";

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Registered successfully");
    }
    return response.data;
  } catch (err) {
    let errorMessage = "Server connection failed. Please try again later.";

    // Secure check: only access .status if .response exists
    if (err.response) {
        if (err.response.status === 401) {
            errorMessage = err.response.data.detail || "Unauthorized access.";
        } else if (err.response.status === 400 || err.response.status === 404) {
            errorMessage = err.response.data.detail;
        }
    } else if (err.message) {
        errorMessage = err.message; // Captures "Network Error"
    }

    toast.error(errorMessage);
    throw err; // Ensure the caller (Redux) knows it failed
}
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + "login", userData);

   if (response.data && response.data.access_token) {
      // FIX: Store the whole object or just the token, 
      // but ensure getUserProfile can find it.
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Logged in successfully");
    }
    return response.data;
  } catch (err) {
    let errorMessage = "Server connection failed. Please try again later.";

    // Secure check: only access .status if .response exists
    if (err.response) {
        if (err.response.status === 401) {
            errorMessage = err.response.data.detail || "Unauthorized access.";
        } else if (err.response.status === 400 || err.response.status === 404) {
            errorMessage = err.response.data.detail;
        }
    } else if (err.message) {
        errorMessage = err.message; // Captures "Network Error"
    }

    toast.error(errorMessage);
    throw err; // Ensure the caller (Redux) knows it failed
}
};

// Logout user
const logout = () => {
  localStorage.removeItem("user")
};

// Get user profile
const getUserProfile = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL + "profile", config);
    return response.data;
} catch (err) {
    let errorMessage = "Server connection failed. Please try again later.";

    // Secure check: only access .status if .response exists
    if (err.response) {
        if (err.response.status === 401) {
            errorMessage = err.response.data.detail || "Unauthorized access.";
        } else if (err.response.status === 400 || err.response.status === 404) {
            errorMessage = err.response.data.detail;
        }
    } else if (err.message) {
        errorMessage = err.message; // Captures "Network Error"
    }

    toast.error(errorMessage);
    throw err; // Ensure the caller (Redux) knows it failed
}
};

const authService = {
  register,
  logout,
  login,
  getUserProfile,
};

export default authService;
