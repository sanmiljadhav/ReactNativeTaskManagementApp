// done
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { assignTask, assignTaskToWorker, fetchWorkers } from "../../api/api"; // Assuming this is the correct API function
import { useRoute } from "@react-navigation/native";
import { useWorkersQuery } from "../../api/apiQueries";
import { useAssignTaskToWorkerMutation } from "../../api/apiMutations";

export default function SingleTaskScreen() {
  // Query hook to fetch workers (assignees)

  const route = useRoute();
  const { taskId } = route.params;
  const { data, isLoading, isError, error } = useWorkersQuery();
  useEffect(() => {}, [data]);

  // Mutation for creating a task
  const assignTaskToWorkerMutation = useAssignTaskToWorkerMutation();

  // Render item for FlatList
  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card]}>
      <Text style={styles.cardTitle}>
        {item.firstName} {item.lastName}
      </Text>

      <Text style={styles.cardDescription}>{item.role}</Text>
      <Text style={styles.cardDetails}>
        <Text style={styles.boldText}>Email:</Text> {item.email}
      </Text>

      {/* View Profile Button */}
      <TouchableOpacity
        style={[styles.button, styles.viewProfileButton]}
        onPress={() => {
          // Implement view profile logic
          assignTaskToWorkerMutation.mutate({
            workerID: item._id,
            taskID: taskId,
          });
        }}
      >
        <Text style={styles.buttonText}>Assign Task</Text>
      </TouchableOpacity>
    </View>
  );

  // Loading or Error states
  if (isLoading) return <Text>Loading workers...</Text>;
  if (isError) {
    console.error("Error fetching workers:", error);
    return (
      <Text>Error fetching workers: {error?.message || "Unknown error"}</Text>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.title}>List of Workers</Text>
        <Text style={styles.subtitle}>
          Select a worker to view more details
        </Text>
      </View>

      {/* FlatList to display workers */}

      {data?.success ? (
        <FlatList
          data={data?.workers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text>No Workers Present</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    marginBottom: 80,
  },
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#4B9CD3",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0F7FF",
    textAlign: "center",
    paddingHorizontal: 20,
  },
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
  viewProfileButton: {
    backgroundColor: "#5bc0de",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
