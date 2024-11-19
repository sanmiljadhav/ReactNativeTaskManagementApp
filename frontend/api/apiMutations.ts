import { useMutation } from "@tanstack/react-query";
import {
  acknowledgeTask,
  signInApi,
  SignInPayload,
  signUpApi,
  SignUpPayload,
  assignTask,
  assignTaskToWorker,
} from "./api";
import Toast from "react-native-toast-message";
import StorageUtils from "../utils/storage_utils";
import { useNavigation } from "@react-navigation/native";

// Custom hook for handling sign-up mutation
export const useSignUpMutation = () => {
  const navigation = useNavigation();

  return useMutation({
    mutationFn: (payload: SignUpPayload) => signUpApi(payload), // Call the sign-up API
    onSuccess: (responseData) => {
      if (responseData?.data?.success) {
        // Show success message from the backend
        Toast.show({
          type: "success",
          text1: "Sign Up Successful!",
          text2:
            responseData?.data?.message || "Your account has been created.",
        });

        // Navigate to the SignIn screen after successful sign-up
        navigation.navigate("SignIn");
      } else {
        // If the success flag is false (error in backend response), show a default error message
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2:
            responseData?.data?.message || "An error occurred during sign-up.",
        });
      }
    },
    onError: (error: any) => {
      // Show a more detailed error message
      if (!error?.response?.data?.success) {
        const errorMessage =
          error?.response?.data?.message ||
          "An unknown error occurred during sign-up";

        console.error("Error details:", {
          status: error?.response?.status,
          message: errorMessage,
        });

        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: errorMessage,
        });
      }
    },
  });
};

// Custom hook for handling sign-in mutation
export const useSignInMutation = () => {
  const navigation = useNavigation();

  return useMutation({
    mutationFn: (payload: SignInPayload) => signInApi(payload), // Sign-in API call
    onSuccess: async (responseData) => {
      if (responseData?.data?.success) {
        const { userToken, role, user } = responseData.data;

        try {
          // Store token and user profile in AsyncStorage
          await StorageUtils.setAPIToken(userToken);
          await StorageUtils.setUserProfile(user);
        } catch (error) {
          console.error("Error storing data in AsyncStorage:", error);
        }

        // Navigate based on user role
        if (role === "Worker") {
          navigation.navigate("WorkerRoutes");
        } else if (role === "Assigner") {
          navigation.navigate("AssigneeRoutes");
        } else {
          navigation.navigate("AdminRoutes");
        }

        // Show success message
        Toast.show({
          type: "success",
          text1: "Sign In Successful!",
          text2: responseData?.data?.message || "Welcome back!",
        });
      }
    },
    onError: (error: any) => {
      console.error("Sign In error:", error);
      if (!error?.response?.data?.success) {
        const errorMessage =
          error?.response?.data?.message ||
          "An unknown error occurred during sign-in";

        // Show error message
        Toast.show({
          type: "error",
          text1: "Sign In Failed",
          text2: errorMessage,
        });
      }
    },
  });
};

// Define the mutation hook for acknowledging a task
export const useAcknowledgeTaskMutation = () => {
  return useMutation({
    mutationFn: (taskPayload: any) => acknowledgeTask(taskPayload),
    onSuccess: (responseData) => {
      if (responseData?.success) {
        Toast.show({
          type: "success",
          text1: "Task Acknowledged Successfully!",
          text2:
            responseData?.message || "Your task has been added to the system.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Task Acknowledgement Failed",
          text2:
            responseData?.data?.message ||
            "An error occurred while acknowledging the task.",
        });
      }
    },
    onError: (error: any) => {
      console.error("Task creation failed:", error);
      if (!error?.response?.data?.success) {
        const { status } = error.response;
        const errorMessage =
          error?.response?.data?.message ||
          "An unknown error occurred during acknowledgment";

        // You can add more detailed logging here if you want
        console.error("Error details:", {
          status,
          message: errorMessage,
        });

        // Show a toast with a more detailed error message
        Toast.show({
          type: "error",
          text1: "Error in Acknowledgement of the task by worker",
          text2: errorMessage,
        });
      }
    },
  });
};

// Mutation to assign a task
export const useCreateTaskMutation = () => {
  return useMutation({
    mutationFn: (taskPayload: any) => assignTask(taskPayload),
    onSuccess: (responseData) => {
      if (responseData?.success) {
        Toast.show({
          type: "success",
          text1: "Task Created Successfully!",
          text2: responseData?.message || "Your task has been added.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Task Creation Failed",
          text2:
            responseData?.data?.message ||
            "An error occurred while creating the task.",
        });
      }
    },
    onError: (error: any) => {
      console.error("Task creation failed:", error);
      if (!error?.response?.data?.success) {
        const { status } = error.response;
        const errorMessage =
          error?.response?.data?.message ||
          "An unknown error occurred during task creation";

        // You can add more detailed logging here if you want
        console.error("Error details:", {
          status,
          message: errorMessage,
        });

        Toast.show({
          type: "error",
          text1: "Task Creation Failed",
          text2: errorMessage,
        });
      }
    },
  });
};

export const useAssignTaskToWorkerMutation = () => {
  return useMutation({
    mutationFn: (taskPayload: any) => assignTaskToWorker(taskPayload),
    onSuccess: (responseData) => {
      if (responseData?.success) {
        Toast.show({
          type: "success",
          text1: "Task Created Successfully!",
          text2:
            responseData?.message || "Your task has been added to the system.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Task Creation Failed",
          text2:
            responseData?.data?.message ||
            "An error occurred while creating the task.",
        });
      }
    },
    onError: (error: any) => {
      console.error("Task creation failed:", error);
      if (!error?.response?.data?.success) {
        const { status } = error.response;
        const errorMessage =
          error?.response?.data?.message ||
          "An unknown error occurred during task assignment";

        Toast.show({
          type: "error",
          text1: "Task Assignment to Worker Failed",
          text2: errorMessage,
        });
      }
    },
  });
};
