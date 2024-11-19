// done
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // For the status dropdown
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { acknowledgeTask, fetchAssignedTasksForWorker } from "../../api/api"; // Add this function to fetch worker-specific tasks
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import StorageUtils from "../../utils/storage_utils";
import { fetchAssignedTasksQuery } from "../../api/apiQueries";
import { useAcknowledgeTaskMutation } from "../../api/apiMutations";


const WorkerAssignedTask: React.FC = () => {
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility state
  const [note, setNote] = useState<string>(""); // Note input state
  const [status, setStatus] = useState<string>("Backlog"); // Default status
  const [selectedTaskId, setSelectedTaskId] = useState<string>(""); // To store task id of the selected task
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const navigation = useNavigation();

  // Query to fetch tasks assigned to the logged-in worker
  const { data, isLoading, isError, error } = fetchAssignedTasksQuery(isComponentMounted);
 

  // Fetch user profile on mount
  const fetchUserProfile = async () => {
    const profile = await StorageUtils.getUserProfile();
    if (profile) {
      setUserProfile(profile); // Save the profile to state
      console.log("User Profile:", profile); // Log the profile or use it for conditional rendering
    }
  };

  useEffect(() => {
    fetchUserProfile();
    setIsComponentMounted(true);
  }, []);

  // Handle modal open action
  const handleOpenModal = (taskId: string) => {
    setSelectedTaskId(taskId); // Set selected task ID when modal is opened
    setIsModalVisible(true); // Open the modal
  };

  // Use the custom mutation hook
  const acknowledgeTaskMutation = useAcknowledgeTaskMutation();


    
  // Handle Acknowledge Task action
  const handleAcknowledgeTask = async () => {
    // Call your mutation or API to update task with the note and status
    if (!note || !status) {
      Toast.show({
        type: "error",
        text1: "Task Is Not Acknowledged",
        text2: "Please fill in mandatory details",
      });
      return;
    }

    const payload = { taskID: selectedTaskId, note, status };

    try {
      acknowledgeTaskMutation.mutate(payload);
      setIsModalVisible(false);
      navigation.replace("WorkerTasks"); // Redirect to worker tasks screen
    } catch (error) {
      console.error("Error acknowledging task:", error);
      Toast.show({
        type: "error",
        text1: "Error Acknowledging Task",
        text2: "There was an error acknowledging the task.",
      });
    }
  };

  // Handle task assignment to worker (navigate to task detail page)
  const handleAssignTaskToWorker = (taskId: string) => {
    navigation.navigate("SingleTaskScreen", { taskId });
  };

  const renderItem = ({ item }: { item: any }) => {
    // Ensure userProfile is available before trying to access it
    if (!userProfile) {
      return null; // You could render a loading spinner or something here if userProfile is not available
    }

    const loggedInUserId = userProfile._id;
    const userObject = item.assigned_to_workers.find(
      (worker) => worker.workerId._id === loggedInUserId
    );

    if (!userObject) {
      return null; // If no matching worker found, don't render the item
    }

    const isTaskAcknowledgedByWorker = userObject.acknowledgedByWorker;

    return (
      <View
        style={[
          isTaskAcknowledgedByWorker ? styles.cardAcknowledged : styles.card,
        ]}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Assignor Name:</Text> {item.assignorName}
        </Text>
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Assignor Email:</Text> {item.assignorEmail}
        </Text>
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Priority:</Text> {item.priority}
        </Text>
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Archived:</Text> {item.isArchived ? "Yes" : "No"}
        </Text>

        {isTaskAcknowledgedByWorker ? (
          <Text style={styles.acknowledgeText}>Task has been already acknowledged by you</Text>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.viewDetailsButton]}
            onPress={() => handleOpenModal(item._id)} // Open modal with the selected task
          >
            <Text style={styles.buttonText}>Acknowledge Task</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Loading or Error states
  if (isLoading) return <Text>Loading tasks...</Text>;
  if (isError) {
    console.error("Error fetching tasks:", error);
    return <Text>Error fetching tasks: {error?.message || "Unknown error"}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.taskList}
      />

      {/* Modal for acknowledging task */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)} // Close modal when back pressed
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Acknowledge Task</Text>

                {/* Text Input for Note */}
                <TextInput
                  style={styles.input}
                  placeholder="Add a note"
                  value={note}
                  onChangeText={setNote}
                  multiline={true} // Allow the input to take multiple lines
                />

                {/* Status Dropdown (Picker) */}
                <Picker
                  selectedValue={status}
                  style={styles.picker}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                >
                  <Picker.Item label="Backlog" value="Backlog" />
                  <Picker.Item label="InProgress" value="InProgress" />
                  <Picker.Item label="Done" value="Done" />
                  <Picker.Item label="Archived" value="Archived" />
                </Picker>

                {/* Acknowledge Button */}
                <TouchableOpacity
                  style={[styles.button, styles.acknowledgeButton]}
                  onPress={handleAcknowledgeTask}
                >
                  <Text style={styles.buttonText}>Acknowledge</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", padding: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B9CD3",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  cardDetails: {
    fontSize: 14,
    color: "#6C757D",
    marginVertical: 3,
  },
  boldText: {
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  viewDetailsButton: {
    backgroundColor: "#5bc0de",
  },
  acknowledgeButton: {
    backgroundColor: "#4CAF50",
  },
  input: {
    width: "100%", // Make the input take the full width of its container
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    textAlignVertical: "top", // Align text to the top if multiline
    height: 100, // You can adjust the height based on your needs
  },
  picker: {
    width: "100%", // Full width for the dropdown
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc", // Border color for the dropdown
    borderRadius: 8,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  taskList: {
    paddingBottom: 20,
  },
  cardAcknowledged: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#e0f7e0", // Light green background for acknowledged worker
    borderWidth: 2,
    borderColor: "green", // Green border when acknowledgedByWorker is true
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // For Android shadow
  },
  acknowledgeText:{
    fontWeight:'bold',
    marginTop:10,
    

  }
});

export default WorkerAssignedTask;
