import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const CreateTaskModal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Assigned');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  // Sample list of assignees (workers) - you can replace this with an actual API call to get workers
  const assignees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
  ];

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCreate = () => {
    const taskData = {
      title,
      description,
      priority,
      status,
      assignees: selectedAssignees,
    };
    console.log('Task Created:', taskData);

    // Reset the form and close modal
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('Assigned');
    setSelectedAssignees([]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Button to Open Modal */}
      <TouchableOpacity style={styles.createTaskButton} onPress={handleOpenModal}>
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.createTaskButtonText}>Create Task</Text>
      </TouchableOpacity>

      {/* Create Task Modal */}
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
              <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Low" value="Low" />
              </Picker>
            </View>

            {/* Status Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Status</Text>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Assigned" value="Assigned" />
                <Picker.Item label="InProgress" value="InProgress" />
                <Picker.Item label="Backlog" value="Backlog" />
                <Picker.Item label="Archived" value="Archived" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

            {/* Assignees Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Assignees</Text>
              <Picker
                selectedValue=""
                onValueChange={(itemValue) => {
                  if (itemValue && !selectedAssignees.includes(itemValue)) {
                    setSelectedAssignees([...selectedAssignees, itemValue]);
                  }
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select Assignee" value="" />
                {assignees.map((assignee) => (
                  <Picker.Item key={assignee.id} label={assignee.name} value={assignee.id} />
                ))}
              </Picker>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.buttonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  createTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B9CD3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  createTaskButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 300,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#4b9cd3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateTaskModal;
