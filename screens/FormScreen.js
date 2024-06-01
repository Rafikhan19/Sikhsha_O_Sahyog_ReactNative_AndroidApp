import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios
import Formshow from './Formshow';

const FormScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    handleGetUserInfo(); // Call handleGetUserInfo when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    fetchFormData();
  }, [userInfo]);

  const handleGetUserInfo = async () => {
    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.post('http://192.168.125.159:8000/user-info', { token });
      const useri = response.data.user;
      setUserInfo(useri);
    } catch (error) {
      setUserInfo(null);
    }
  };

  const fetchFormData = async () => {
    try {
      const response = await axios.get('http://192.168.125.159:8000/forms', {
        params: {
          createdBy: userInfo?.email // Specify the createdBy value here
        }
      });
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFormData();
    }, [userInfo])
  );

  const soaEmailRegex = /^[a-zA-Z0-9._%+-]+@soa.ac.in$/;
  const checkEmail = soaEmailRegex.test(userInfo?.email);

  return (
    <View style={styles.container}>{checkEmail ? (
      <View >
        <Text style={styles.title}>Create and share your forms</Text>
        <Pressable
          onPress={() => {
            handleGetUserInfo(); // Call handleGetUserInfo when the user taps the button
            navigation.navigate("FormCreation", { createdby: userInfo?.email });
          }}
          style={styles.createButton}
        >
          <Text style={styles.buttonText}>Create</Text>
        </Pressable>
        <ScrollView>
          <View style={styles.formContainer}>
            {forms && forms.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Form", { formStructureId: item._id, createdBy: item?.createdBy, formName: item?.formName, formStructure: item.formStructure, responses: item?.responses })
                }
                key={item._id || index.toString()}
                style={styles.formItem}
              >
                <Text style={styles.formText}>{item.formName}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    ) : (
      <Formshow />
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#032030"
  },
  title: {
    padding: 30,
    marginTop: 40,
    fontSize: 35,
    color:"white"
  },
  createButton: {
    width: 367,
    backgroundColor: "#BAE5F4",
    borderRadius: 10,
    padding: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#032030",
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  formItem: {
    marginVertical: 25,
    marginHorizontal: 20,
    flexDirection: "row",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#6200EE",
  },
  formText: {
    width: 120,
    height: 30,
    color: "white",
    textAlign: "center",
    textTransform: "capitalize",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormScreen;
