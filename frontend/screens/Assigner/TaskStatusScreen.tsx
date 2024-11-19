//done
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleTask } from "../../api/api"; // Assuming the API call function
import { useFetchSingleTaskQuery } from "../../api/apiQueries";

export default function TaskStatusScreen() {
  const route = useRoute();
  const { taskId } = route.params; // Retrieve the taskId passed from the previous screen

  // Fetch task details using the useQuery hook
  // Use the custom hook to fetch task details
  const { data, isLoading, isError, error } = useFetchSingleTaskQuery(taskId);
  

  // Loading and Error States
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading task details...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error fetching task: {error?.message || "Unknown error"}</Text>
      </View>
    );
  }

  const task = data?.task;

  // Render Worker details

  const renderWorkerItem = ({ item }: { item: any }) => {
    return (
      <View
        style={
          item.acknowledgedByWorker
            ? styles.workerCardAcknowledged
            : styles.workerCard
        }
      >
        <Text>
          <Text style={styles.workerCardHeaderText}>Name: </Text>
          {item.workerId.firstName} {item.workerId.lastName}
        </Text>
        <Text>
          <Text style={styles.workerCardHeaderText}>
            Acknowledged By Worker:{" "}
          </Text>
          {String(item.acknowledgedByWorker)}
        </Text>
        <Text style={styles.workerCardHeaderText}>Status: {item.status}</Text>
        <Text style={styles.workerCardHeaderText}>
          Note Added By Worker: <Text>{item.noteAddedByWorker}</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Title: {task?.title}</Text>
      <Text style={styles.description}>
        Task Description: {task?.description}
      </Text>
      <Text style={styles.details}>Priority: {task?.priority}</Text>
      <Text style={styles.details}>
        Archived: {task?.isArchived ? "Yes" : "No"}
      </Text>

      <Text style={styles.subTitle}>Assigned Workers:</Text>
      <FlatList
        data={task?.assigned_to_workers || []}
        renderItem={renderWorkerItem}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={styles.workerList}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("Edit task functionality")}
      >
        <Text style={styles.buttonText}>Edit Task</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the TaskStatusScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B9CD3",
    marginBottom: 10,
    // color:'#4B9CD3',
  },
  description: {
    fontSize: 16,
    color: "#4B9CD3",
    marginBottom: 10,
  },
  details: {
    fontSize: 20,
    color: "#6C757D",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  workerList: {
    paddingBottom: 20,
  },
  workerCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    backgroundColor: "#4B9CD3",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  workerCardHeaderText: {
    color: "black",
    fontWeight: "bold",
  },
  workerCardAcknowledged: {
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
});
