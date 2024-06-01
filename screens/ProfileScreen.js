import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TextInput, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isView, setIsView] = useState(true); // State to toggle between images

  useEffect(() => {
    // Fetch user info on component mount
    handleGetUserInfo();

    // Toggle between images every 2 seconds
    const interval = setInterval(() => {
      setIsView(prevState => !prevState);
    }, 3000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleGetUserInfo = async () => {
    const token = await AsyncStorage.getItem('authToken');

    try {
      const response = await axios.post('http://192.168.125.159:8000/user-info', { token });
      setUserInfo(response.data.user);
    } catch (error) {
      setUserInfo(null);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Login');
  };

  const updateRegistrationNumber = async () => {
    try {
      const response = await axios.post('http://192.168.125.159:8000/studentRegistration', { registrationNumber, emailId: userInfo.email });
      setModalVisible(false);
      // Fetch user info again to update the displayed registration number
      await handleGetUserInfo();
      // Refresh the whole app
      navigation.replace('main');
    } catch (error) {
      console.error('Error updating registration number:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Siksha 'O' Sahayog</Text>
      <View style={styles.imageContainer}>
        {isView ? (
          <Image source={require("../assets/Boy.jpg")} style={styles.image} />
        ) : (
          <Image source={require("../assets/girl.jpg")} style={styles.image} />
        )}
      </View>

      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo1}>{userInfo.name.toUpperCase()}</Text>

          <Text style={styles.userInfo2}>{userInfo.registraionNumber}</Text>
        </View>
      )}

      <View style={styles.profileFooter}>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <AntDesign name="logout" size={24} color="red" /><Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Feather name="info" size={24} color="orange" /><Text style={styles.logoutButtonText}>About us</Text>
        </Pressable>
      </View>



      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter Registration Number"
              value={registrationNumber}
              onChangeText={text => setRegistrationNumber(text)}
            />
            <Pressable style={styles.button} onPress={updateRegistrationNumber}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: '#FF6347' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Registration Number</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#080826"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    color:"#ECF9FC"
  },
  imageContainer: {
    height: 200,
    width: 200,
    marginBottom: 30,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  userInfoContainer: {
    alignItems: 'center',
    // marginBottom: 80,
  },
  userInfo1: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color:"#ECF9FC"
  },
  userInfo2: {
    fontSize: 16,
    fontWeight: "500",
    color:"#ECF9FC"
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: 'white',
    borderRadius: 25,
    marginBottom: 20,
    width:300,
    height: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutButtonText: {
    marginHorizontal: 10,
    color: "black",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderBottomColor:'grey',
    borderBottomWidth:1,
    
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#90EE90",
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: "500",
    fontSize:18,
  },
  addButton: {
    backgroundColor: "#2A60FF",
    borderRadius: 30,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  profileFooter: {
    alignSelf: "flex-start",
    paddingHorizontal: 55
  }
});

export default ProfileScreen;
