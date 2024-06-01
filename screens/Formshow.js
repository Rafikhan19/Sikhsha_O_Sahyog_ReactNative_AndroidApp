import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

const Formshow = () => {
  const [formStructures, setFormStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const navigation = useNavigation();
  const handleGetUserInfo = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post('http://192.168.125.159:8000/user-info', { token });
      const user = response.data.user;
      setRegistrationNumber(user.registraionNumber); // Corrected typo in "registrationNumber"
    } catch (error) {
      setRegistrationNumber(null);
    }
  };

  useEffect(() => {
    handleGetUserInfo();
  }, [registrationNumber]);

 
    const fetchFormDetails = async () => {
      try {
        if (!registrationNumber) return; // Exit early if registrationNumber is falsy
        
        const response = await axios.get(`http://192.168.125.159:8000/form-details/${registrationNumber}`);
        const formData = response.data.formStructures; // Assuming response.data is an object with a key 'formStructures'
        
        setFormStructures(formData); // Assuming formData is an array
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to fetch form details');
        setLoading(false);
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        fetchFormDetails();
      }, [registrationNumber])
    ) 
 

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{padding:30}}>
        <Text style={{ width: 150, height: 30, color: "#6200EE", textAlign: "center", textTransform: "uppercase", fontSize: 16, fontWeight: "bold" }}>Empty Form list</Text>
      </View>
    );
  }

  return (
    <View style={{padding:30}}>
      <Text  style={{ width: 150, height: 30, color: "#6200EE", textAlign: "center", textTransform: "uppercase", fontSize: 16, fontWeight: "bold" }}>Formshow</Text>
      {formStructures.map((item, index) => (
        <Pressable
                      onPress={() =>
                        navigation.navigate("FormSubmission", {
                          formStructureId:item._id, formStructure:item.formStructure
                        })
                      }
                      key={item._id || index.toString()}
                      style={{
                        marginVertical: 10,
                        marginHorizontal: 15,
                        flexDirection: "row",
                        borderRadius: 6,
                        padding: 12,
                        alignItems: "center",
                        backgroundColor: "#6200EE",
                        justifyContent:"center",
                        alignItems:"center"

                      }}
                    >
                      <Text
                        style={{ width: 150, height: 30, color: "white", textAlign: "center", textTransform: "capitalize", fontSize: 16, fontWeight: "bold" }}
                        key={item._id}
                      >  {item.formName}
                      </Text>
                    </Pressable>
      ))}
    </View>
  );
};

export default Formshow;
