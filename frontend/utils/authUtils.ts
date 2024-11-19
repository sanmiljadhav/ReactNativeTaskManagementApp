// utils/authUtils.ts
import { NavigationProp } from '@react-navigation/native';
import StorageUtils from './storage_utils'; // Import StorageUtils for clearing the storage
import Toast from 'react-native-toast-message';

// Define the logout function
export const logout = async (navigation: NavigationProp<any, any>) => {
  try {
    // Remove all stored data (token and user profile)
    await StorageUtils.removeAll();
    console.log("User data cleared from storage.");

    // Navigate to the login screen
    navigation.navigate('SignIn');  // Adjust the 'Login' route name as per your navigation

    // Optionally, show a success message
    Toast.show({
      type: 'success',
      text1: 'Logged out successfully!',
      text2: 'You have been logged out of the app.',
    });

  } catch (error) {
    console.error("Error during logout:", error);

    // Optionally, show an error message if something goes wrong
    Toast.show({
      type: 'error',
      text1: 'Logout Failed',
      text2: 'An error occurred while logging you out.',
    });
  }
};
