import React from 'react';
import { View, Text, StyleSheet,Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../utils/authUtils';

const Profile: React.FC = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Worker! This is your Profile Screen.</Text>
      <Button
        title="Log Out"
        onPress={() => logout(navigation)} // Call logout and pass the navigation object
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;