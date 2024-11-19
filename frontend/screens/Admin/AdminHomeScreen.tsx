// done
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { fetchAllTasks, fetchAllTasksForAdmin } from "../../api/api";
import { useAdminTasksQuery } from "../../api/apiQueries";

interface AssignedWorker {
  _id: string;
  acknowledgedByWorker: boolean;
  noteAddedByWorker: string;
  status: string;
  workerId: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  assignorName: string;
  assignorEmail: string;
  priority: string;
  isArchived: boolean;
  assigned_to_workers: AssignedWorker[];
  createdAt: string;
  updatedAt: string;
}

const AdminScreen = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Fetch tasks using React Query
  const { data, isLoading, isError, error } = useAdminTasksQuery();
  
  // Render individual task cards

  const renderItem = ({ item }: { item: Task }) => {
    return (
      <View style={[styles.card, item.isArchived ? styles.archivedCard : {}]}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Assignor:</Text> {item.assignorName} (
          {item.assignorEmail})
        </Text>
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Priority:</Text> {item.priority}
        </Text>
        <Text style={styles.cardDetails}>
          <Text style={styles.boldText}>Archived:</Text>{" "}
          {item.isArchived ? "Yes" : "No"}
        </Text>

        {item.assigned_to_workers?.length > 0 && (
          <View style={styles.workerContainer}>
            <Text style={styles.boldText}>Assigned Workers:</Text>
            {item.assigned_to_workers.map((worker) => {
              
              return (
                <View key={worker._id} style={styles.workerCard}>
                  <View style={styles.workerInfo}>
                    <Text style={styles.workerStatus}>
                      Status:{" "}
                      <Text style={styles[worker.status.toLowerCase()]}>
                        {" "}
                        {worker.status}
                      </Text>
                    </Text>
                    <Text style={styles.acknowledgmentText}>
                      Acknowledged: {worker.acknowledgedByWorker ? "Yes" : "No"}
                    </Text>
                  </View>
                  {worker.noteAddedByWorker && (
                    <Text style={styles.workerNote}>
                      Note: {worker.noteAddedByWorker}
                    </Text>
                  )}

                  {/* Display worker's personal details (from workerId) */}
                  {worker.workerId && (
                    <View style={styles.workerDetails}>
                      <Text style={styles.boldText}>Worker Details:</Text>
                      <Text>
                        Name: {worker.workerId.firstName}{" "}
                        {worker.workerId.lastName}
                      </Text>
                      <Text>Email: {worker.workerId.email}</Text>
                      <Text>Role: {worker.workerId.role}</Text>
                      {/* Display other worker details as needed */}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Task Management</Text>

      {isLoading && <Text>Loading tasks...</Text>}
      {isError && <Text>Error loading tasks. {String(error)}</Text>}
      {data?.tasks && (
        <FlatList
          data={data.tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.taskList}
        />
      )}

     
    </View>
  );
};

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Lighter background for better contrast
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 20,
  },
  taskList: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: "#2C3E50",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: "#3498db", // Blue accent
  },
  archivedCard: {
    backgroundColor: "#f9f9f9",
    borderLeftColor: "#e74c3c", // Red for archived
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C3E50",
  },
  cardDescription: {
    fontSize: 15,
    color: "#7f8c8d",
    marginVertical: 8,
  },
  cardDetails: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 6,
  },
  boldText: {
    fontWeight: "bold",
    color: "#34495e", // Darker color for better contrast
  },
  workerContainer: {
    marginTop: 15,
  },
  workerCard: {
    backgroundColor: "#ecf0f1",
    padding: 15,
    marginTop: 12,
    borderRadius: 8,
    shadowColor: "#2C3E50",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  workerInfo: {
    marginBottom: 10,
  },
  workerStatus: {
    fontSize: 15,
    color: "#2C3E50",
    marginTop: 6,
  },
  acknowledgedText: {
    color: "#27ae60", // Green color for acknowledgment
  },
  acknowledgmentText: {
    fontSize: 14,
    color: "#95a5a6", // Lighter grey for acknowledgment text
  },
  workerNote: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 8,
  },
  workerDetails: {
    marginTop: 10,
    paddingLeft: 20,
  },
  workerDetailsText: {
    fontSize: 14,
    color: "#34495e",
    marginTop: 5,
  },
  viewDetailsButton: {
    backgroundColor: "#3498db", // Primary blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    width: "85%",
    borderRadius: 16,
    padding: 25,
    elevation: 10,
    maxHeight: "80%", // Ensure modal doesn't take up too much space
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 12,
    color: "#7f8c8d",
  },
  modalWorkerDetails: {
    paddingVertical: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#3498db",
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: "#3498db", // Blue accent for consistency
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});


export default AdminScreen;
