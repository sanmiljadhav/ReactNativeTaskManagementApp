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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { fetchWorkers, assignTask, fetchAllTasks } from "../../api/api";
import { Picker } from "@react-native-picker/picker";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useFetchAllTasks } from "../../api/apiQueries";
import { useCreateTaskMutation } from "../../api/apiMutations";

const AssigneeTaskModal: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Backlog");
  const [isArchived, setIsArchived] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(false);

  // Query to fetch all tasks after task creation
  // Query to fetch all tasks after task creation

  const { data, isLoading, isError, refetch, error } = useFetchAllTasks(isComponentMounted);
 
  
  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  // Mutation for creating a task
  const createTaskMutation = useCreateTaskMutation()

  // Handle modal open action
  const handleOpenModal = () => {
    setModalVisible(true);
    refetch(); // Fetch workers only when modal opens
  };

  // Handle modal close action
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Handle task creation
  const handleCreateTask = () => {
    const taskData = {
      title,
      description,
      priority,
      status,
      isArchived: false,
    };

    createTaskMutation.mutate(taskData);
    setTaskCreated(true);
    resetForm(); // Reset form fields after mutation
  };

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setStatus("Backlog");
  };

  // Loading or Error states
  if (isLoading) return <Text>Loading workers...</Text>;
  if (isError) {
    console.error("Error fetching workers:", error);
    return (
      <Text>Error fetching workers: {error?.message || "Unknown error"}</Text>
    );
  }

  const handleAssignTaskToWorker = (taskId:string) => {
    navigation.navigate("SingleTaskScreen",{
      taskId
    });
  };


  const renderItem = ({ item }: { item: any }) => {
    // Check if the task has assigned workers
    const assignedWorker = item?.assigned_to_workers?.length > 0;
    const assignedWorkerText = assignedWorker ? "Assigned" : "Not Assigned";
    
    // If there are assigned workers, show the "Check Assignment Status" button
    const renderAssignmentStatusButton = assignedWorker && (
      <TouchableOpacity
        style={[styles.button, styles.checkStatusButton]}
        onPress={() => handleCheckAssignmentStatus(item._id)}
      >
        <Text style={styles.buttonText}>Check Assignment Status</Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={[styles.card]}>
        {/* Task Title */}
        <Text style={styles.cardTitle}>{item.title}</Text>
  
        {/* Task Description */}
        <Text style={styles.cardDescription}>{item.description}</Text>
  
        {/* Assigned Worker */}
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Assigned to Worker:</Text> {assignedWorkerText}
        </Text>
  
        {/* Priority */}
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Priority:</Text> {item.priority}
        </Text>
  
        {/* Archive Status */}
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Archived:</Text> {item.isArchived ? "Yes" : "No"}
        </Text>
  
        {/* Assign Task To Worker Button */}
        
          <TouchableOpacity
            style={[styles.button, styles.viewDetailsButton]}
            onPress={() => handleAssignTaskToWorker(item._id)}
          >
            <Text style={styles.buttonText}>Assign Task To Worker</Text>
          </TouchableOpacity>
        
  
        {/* Check Assignment Status Button */}
        {renderAssignmentStatusButton}
      </View>
    );
  };
  
  // Handle "Check Assignment Status" button
  const handleCheckAssignmentStatus = (taskId: string) => {
    // Navigate to a task details screen or show task status directly
    navigation.navigate("TaskStatusScreen", { taskId });
  };
  

 

  return (
    <View style={styles.container}>
      {/* Button to open modal */}
      <TouchableOpacity
        style={styles.createTaskButton}
        onPress={handleOpenModal}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.createTaskButtonText}>Create Task</Text>
      </TouchableOpacity>

      {/* Modal to create task */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Task</Text>

            {/* Task Title */}
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={title}
              onChangeText={setTitle}
            />

            {/* Task Description */}
            <TextInput
              style={styles.input}
              placeholder="Task Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Priority Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Priority</Text>
              <View style={styles.picker}>
                <Picker selectedValue={priority} onValueChange={setPriority}>
                  <Picker.Item label="High" value="High" />
                  <Picker.Item label="Medium" value="Medium" />
                  <Picker.Item label="Low" value="Low" />
                </Picker>
              </View>
            </View>

            {/* Status Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Status</Text>
              <View style={styles.picker}>
                <Picker selectedValue={status} onValueChange={setStatus}>
                  <Picker.Item label="InProgress" value="InProgress" />
                  <Picker.Item label="Backlog" value="Backlog" />
                  <Picker.Item label="Archived" value="Archived" />
                  <Picker.Item label="Done" value="Done" />
                </Picker>
              </View>
            </View>

            {/* Assignees Dropdown */}
            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateTask}
              >
                <Text style={styles.buttonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={data?.tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", padding: 20 },
  createTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4B9CD3",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  createTaskButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: 300,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  dropdownContainer: { marginBottom: 15 },
  dropdownLabel: { fontSize: 16, marginBottom: 5, color: "#333" },
  picker: { height: 40, borderRadius: 8, backgroundColor: "#f5f5f5" },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: "#4b9cd3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  flatListContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
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
  archivedCard: {
    backgroundColor: "#f8d7da", // Light red for archived tasks
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
  archiveButton: {
    backgroundColor: "#f0ad4e",
  },
  viewDetailsButton: {
    backgroundColor: "#5bc0de",
  },
  checkStatusButton: {
    backgroundColor: "green",  // A distinct color for the status button
    marginTop: 10,
  },
});

export default AssigneeTaskModal;
