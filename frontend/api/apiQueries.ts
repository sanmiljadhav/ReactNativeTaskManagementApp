import { useQuery } from "@tanstack/react-query";
import { fetchAllTasksForAdmin,fetchAssignedTasksForWorker,fetchAllTasks,fetchWorkers,fetchSingleTask } from "./api"; // Ensure the API functions are correctly imported
import Toast from "react-native-toast-message";


//ADMIN QUERIES
// Query to fetch tasks for the admin view
export const useAdminTasksQuery = () => {
  return useQuery({
    queryKey: ["adminViewsTasks"],
    queryFn: fetchAllTasksForAdmin,
    onError: (err) => {
      console.error("Error fetching tasks:", err);
    },
  });
};


// WORKER

// Fetch tasks assigned to the worker
export const fetchAssignedTasksQuery = (isComponentMounted: boolean) => {
    return useQuery({
      queryKey: ["assignedTasksForWorker", isComponentMounted],
      queryFn: fetchAssignedTasksForWorker,
      enabled: isComponentMounted,
      onError: (err) => {
        console.log("Error:", err);
        Toast.show({
          type: "error",
          text1: "Error Fetching Tasks",
          text2: "Failed to fetch assigned tasks.",
        });
      },
    });
  };


  //ASSIGNOR QUERIES
export const useFetchAllTasks = (isComponentMounted: boolean) => {
  return useQuery({
    queryKey: ["tasks", isComponentMounted],
    queryFn: fetchAllTasks,
    enabled: isComponentMounted,
    onError: (err) => {
      console.error("Error fetching tasks:", err);
      Toast.show({
        type: "error",
        text1: "Error Fetching Tasks",
        text2: "Failed to fetch tasks.",
      });
    },
  });
};


export const useWorkersQuery = () => {
  return useQuery({
    queryKey: ['workers'],
    queryFn: fetchWorkers,
    enabled: true,
    onError: (err) => {
      console.log('Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error Fetching Users',
        text2: 'Failed to fetch users with the "worker" role.',
      });
    },
  });
};


export const useFetchSingleTaskQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId], // Unique query key, dependent on taskId
    queryFn: () => fetchSingleTask(taskId), // API call to fetch the single task
    enabled: !!taskId, // Ensure the query is only enabled when taskId is available
    onError: (err: any) => {
      console.log("Error fetching task:", err);
    },
  });
};

