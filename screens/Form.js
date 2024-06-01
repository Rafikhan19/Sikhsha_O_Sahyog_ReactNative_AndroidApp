import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
const Form = ({ route }) => {
  const { formStructureId, createdBy, formName, formStructure, responses } = route.params;
  const navigation = useNavigation();
  const [selectedValues, setSelectedValues] = useState({});
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState(null); // State to store form data for sharing
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const handleSelectOption = (questionIndex, optionIndex) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [questionIndex]: optionIndex,
    }));
  };

  const renderInput = (question, questionIndex) => {
    if (question.answerType === 'text') {
      return <TextInput style={styles.input} placeholder="Type your answer" />;
    } else if (question.answerType === 'multipleChoice') {
      return (
        <View>
          {question.options.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.radioButton}>
              <RadioButton.Android
                value={option}
                status={
                  selectedValues[questionIndex] === optionIndex ? 'checked' : 'unchecked'
                }
                onPress={() => handleSelectOption(questionIndex, optionIndex)}
                color="#007BFF"
              />
              <Text style={styles.radioLabel}>{option}</Text>
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  const shareClass = async () => {
    const username = createdBy;
    try {
      const response = await axios.get(`http://192.168.125.159:8000/createdClassrooms/${username}`);
      console.log(response.data.classrooms)
      setClassrooms(response.data.classrooms);
      setFormData(selectedValues); // Store form data for sharing
      setModalVisible(true); // Show modal after fetching classrooms
    } catch (error) {
      setClassrooms([]);
      Alert.alert('Error', 'Failed to fetch classrooms');
    }
  };

  const sendForm = async (classroom, formStructureId) => {
    try {
      // Extract classroom ID from the classroom object
      const classroomId = classroom._id;

      // Send a POST request to the backend endpoint '/send-form-to-students'
      const response = await axios.post('http://192.168.125.159:8000/send-form-to-students', {
        classroomId,
        formStructureId
      });

      // Handle success response
      Alert.alert('Success', `Form shared with ${classroom.subject}`);
    } catch (error) {
      // Handle error
      Alert.alert('Error', `Failed to send form to ${classroom.subject}`);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.formName}>{formName}</Text>
        <Pressable onPress={() => {
          navigation.navigate("StudentSubmission", { formStructureId: formStructureId })
        }}>
          <AntDesign name="eye" size={24} color="black" />
        </Pressable>
        <Pressable onPress={shareClass}>
          <Entypo name="share" size={24} color="black" />
        </Pressable>
      </View>
<View style={styles.questionContainer}>
      {formStructure.questions.map((question, index) => (
        <View key={index} >
          <Text style={styles.questionText}>{question.question}</Text>
          {renderInput(question, index)}
        </View>
      ))}
</View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Share Form</Text>
              <Pressable onPress={() => { setModalVisible(false); }}>
              <Entypo name="cross" size={24} color="white" />
              </Pressable>
            </View>

            <ScrollView style={styles.scroll}>
              {classrooms.map((classroom, index) => (
                <View key={classroom._id} style={styles.classroomItemContainer}>
                  <Text style={styles.classroomName}>{classroom.subject}</Text>
                  <TouchableOpacity
                    key={index}
                    style={styles.sendButton}
                    onPress={() => {
                      // setModalVisible(false); // Close modal when classroom is selected
                      sendForm(classroom, formStructureId); // Send form to selected classroom
                    }}
                  >

                    <Ionicons name="send" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "15%",
    // paddingHorizontal: "5%",
    backgroundColor: "#BAE5F4"
  },
  header: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
    marginBottom: 20,

  },

  formName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 20,
    width:"90%",
    borderRadius:30,
    padding:30,
    backgroundColor:"white",
    marginHorizontal:20
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#032030',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#032030',
   
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"white"
  },
  classroomItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  classroomName: {
    fontSize: 18,
    fontWeight:"500"
  },
  sendButton: {
    backgroundColor: '#BAE5F4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    opacity: 1,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#032030',
  },
});

export default Form;
