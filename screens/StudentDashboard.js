import React, { useState, useEffect, useFocusEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentDashboard = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [studentDetails, setStudentDetails] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);



  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post('http://192.168.125.159:8000/user-info', { token });
      const user = response.data.user;
      setUserInfo(user);
    } catch (error) {
      console.error('Error fetching user information:', error);
      setError('Error fetching user information');
    }
  };

  const fetchStudentDetails = async (registrationNumber) => {
    try {
      const response = await axios.get(`http://192.168.125.159:8000/student/${registrationNumber}`);
      setStudentDetails(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Error fetching student details');
      setStudentDetails([]);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.registraionNumber) {
      setRegistrationNumber(userInfo.registraionNumber.toString());
      fetchStudentDetails(userInfo.registraionNumber);
    }
  }, [userInfo]);

  return (
    <View style={{ marginTop: 30, justifyContent: "center", alignItems: "center", padding: 10 }}>
      {userInfo ? (
        <View style={{
          width: "100%", height: 100, backgroundColor: "#FEBE10", justifyContent: "center", alignItems: "center", borderBottomLeftRadius: 50, borderBottomRightRadius: 50, elevation: 7, // Add elevation for shadow effect
          shadowColor: "#000", // Shadow color
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          marginBottom: 20,
        }}>
          <Text style={styles.info}>{userInfo.name}</Text>
          <Text style={styles.info}>{userInfo.registraionNumber}</Text>
        </View>


      ) : (
        <View>
          <Text>Add the details to the profile</Text>
        </View>
      )}

      {error && <Text>{error}</Text>}
      <FlatList
        data={studentDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            <View style={{
              height: 100,
              backgroundColor: "#90EE90",
              borderRadius: 35,
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              paddingHorizontal: 25,
              elevation: 7, // Add elevation for shadow effect
              shadowColor: "#000", // Shadow color
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              marginBottom: 20, // Adjust as needed
            }}>
              {/* <Text style={styles.stdText}>Teacher: {item.createdby}</Text> */}
              <View style={{ width: 70, height: 50, borderRadius: 50, backgroundColor: "white", alignItems: "center", justifyContent: "center", marginVertical: 23, marginHorizontal: 15 }}><Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.subject}</Text></View>
              <Text style={styles.stdText}>Due  :{item.dueAssignments}</Text>
              <Text style={styles.stdText}>Submitted  :{item.submittedAssignments}</Text>
            </View>
            <Text
              style={{
                height: 1,
                width: "100%",
                borderColor: "#D0D0D0",

                borderWidth: 2,
                marginTop: 10,
              }}
            />
          </>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  info: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  stdText: {
    width: 100,
    marginVertical: 3,
    fontSize: 16,

    fontWeight: "500"

  }
})

export default StudentDashboard;

