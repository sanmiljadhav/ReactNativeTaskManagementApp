import axios from "axios";
import { getHeadersWithToken } from "../utils/getHeadersWithToken";
// const API_BASE_URL = "https://945e-103-211-190-131.ngrok-free.app";
import StorageUtils from "../utils/storage_utils";

export interface SignUpPayload {
  firstName: string;
  lastName: String;
  email: string;
  password: string;
  role: string;
}
export interface SignInPayload {
  email: string;
  password: string;
}
export interface CreateTaskPayload {
  title: string;
  description: string;
  assignees: {
    userId: string;
    email: string;
  }[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
  dueDate: string; // ISO 8601 date string
}
export interface AllTasks {
  _id: string; // The unique task ID from MongoDB
  title: string;
  description: string;
  ownerName: string;
  assignees: {
    userId: string;
    email: string;
    _id: string; // Unique identifier for the assignee relation (if needed)
  }[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
}

export const API_BASE_URL = "http://192.168.1.3:3000/api/v1";

export const USER_API_ENDPOINTS = {
  login: "/user/signIn", // Login user endpoint
  register: "/user/signUp",
  getUser: "/user/get-user", // Get user endpoint
  updateUser: "/user/update-user", // Update user info
  // Add more endpoints here as needed
};

export const WORKER_API_ENDPOINTS = {
  fetchWorkers: "/worker",
  fetchAssignedTasksForWorker: "/worker/taskAssignedToWorker",
  acknowledgeTask: "/worker/acknowledgeTask",
};

export const TASK_API_ENDPOINTS = {
  fetchAllTasks: "/tasks",
  assignTask: "/tasks",
  assignTaskToWorker: "/tasks",
  fetchSingleTask: "/tasks/:id",
};

export const ADMIN_API_ENDPOINTS = {
  fetchAllTasksForAdmin: "/admin/tasks",
};


// Mutations for signUp and signIn

export const signUpApi = async (payload: SignUpPayload) => {
  try {
    return axios.post(`${API_BASE_URL}${USER_API_ENDPOINTS.register}`, payload);
  } catch (error) {
    console.log("Error in signUpAPI", error);
    throw error; // Handle error globally
  }
};

export const signInApi = async (payload: SignUpPayload) => {
  try {
    return axios.post(`${API_BASE_URL}${USER_API_ENDPOINTS.login}`, payload);
  } catch (error) {
    console.log("Error in signInAPI", error);
    throw error; // Handle error globally
  }
};

export const fetchWorkers = async () => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching data)
    const response = await axios.get(
      `${API_BASE_URL}${WORKER_API_ENDPOINTS.fetchWorkers}`, // Assuming this is the endpoint to fetch workers
      { headers } // Include the headers with the token
    );

    // Return the response data

    return response.data;
  } catch (error) {
    console.log("Error in fetchWorkers API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

export const assignTask = async (payload: any) => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching data)
    const response = await axios.post(
      `${API_BASE_URL}${TASK_API_ENDPOINTS.assignTask}`,
      payload,
      { headers }
    );
    // Return the response data

    return response.data;
  } catch (error) {
    console.log("Error in assignTask API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

export const fetchAllTasks = async () => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching data)
    const response = await axios.get(
      `${API_BASE_URL}${TASK_API_ENDPOINTS.fetchAllTasks}`, // Assuming this is the endpoint to fetch workers
      { headers } // Include the headers with the token
    );

    // Return the response data

    return response.data;
  } catch (error) {
    console.log("Error in fetchAllTasks API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

export const assignTaskToWorker = async (payload: any) => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching data)
    const response = await axios.put(
      `${API_BASE_URL}${TASK_API_ENDPOINTS.assignTaskToWorker}`,
      payload,
      { headers }
    );
    // Return the response data

    return response.data;
  } catch (error) {
    console.log("Error in assignTaskToWorker API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

export const fetchAssignedTasksForWorker = async () => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching data)
    const response = await axios.get(
      `${API_BASE_URL}${WORKER_API_ENDPOINTS.fetchAssignedTasksForWorker}`, // Assuming this is the endpoint to fetch workers
      { headers } // Include the headers with the token
    );

    // Return the response data

    return response.data;
  } catch (error) {
    console.log("Error in fetchAssignedTasksForWorker API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

//acknowledgeTask

export const acknowledgeTask = async (payload: any) => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching data)
    const response = await axios.put(
      `${API_BASE_URL}${WORKER_API_ENDPOINTS.acknowledgeTask}`,
      payload,
      { headers }
    );
    // Return the response data
    return response.data;
  } catch (error) {
    console.log("Error in Acknowledge Task API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

export const fetchSingleTask = async (taskId: string) => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching a single task)
    const response = await axios.get(
      `${API_BASE_URL}${TASK_API_ENDPOINTS.fetchSingleTask.replace(
        ":id",
        taskId
      )}`, // Replace :id with the actual taskId
      { headers } // Include the headers with the token
    );

    // Return the response data
    return response.data; // This should return the single task object
  } catch (error) {
    console.log("Error in fetchSingleTask API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

export const fetchAllTasksForAdmin = async () => {
  try {
    // Get the headers with the token
    const { headers } = await getHeadersWithToken();

    // Send the API request with the correct headers (using GET for fetching data)
    const response = await axios.get(
      `${API_BASE_URL}${ADMIN_API_ENDPOINTS.fetchAllTasksForAdmin}`, // Assuming this is the endpoint to fetch workers
      { headers } // Include the headers with the token
    );

    // Return the response data
    return response.data;
  } catch (error) {
    console.log("Error in fetchAllTasksForAdmin API:", error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};
