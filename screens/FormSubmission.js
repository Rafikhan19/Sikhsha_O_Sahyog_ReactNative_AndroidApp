import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native"
const FormSubmission = ({ route }) => {
  const {formStructureId, formStructure } = route.params;
  const navigation = useNavigation();
  const [formResponses, setFormResponses] = useState([]);
  const [emailId, setEmailId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [section, setSection] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleSelectOption = (questionIndex, optionIndex, option) => {
    const updatedResponses = [...formResponses];
    updatedResponses[questionIndex] = { questionNo: questionIndex, value: option };
    setFormResponses(updatedResponses);
  };

  const handleTextInputChange = (text, questionIndex) => {
    const updatedResponses = [...formResponses];
    updatedResponses[questionIndex] = { questionNo: questionIndex, value: text };
    setFormResponses(updatedResponses);
  };

  const handleSubmitDetails = () => {
    if (!emailId||!registrationNumber||!serialNumber||!section){
      Alert.alert("fill the details properly!!")
    } else{

      setShowQuestions(true);
    }
  };

  const handleSubmitForm = async () => {
   

    try {
      // Prepare the data to be sent to the backend
      const requestData = {
        formStructureId: formStructureId, // Replace with actual formStructureId
        formData: {
          emailId,
          registrationNumber,
          serialNumber,
          section,
          formResponses
        }
      };
  
      // Send POST request to your backend API
      await axios.post('http://192.168.125.159:8000/submit-response', requestData);
  
      // Reset form fields after successful submission
      setEmailId('');
      setRegistrationNumber('');
      setSerialNumber('');
      setSection('');
      setFormResponses([]);

      setShowSuccessMessage(true);

      // Optionally, you can also hide the form questions if needed
      setShowQuestions(false);
   

      
      // Optionally, display a success message to the user
      console.log('Form response submitted successfully.');

    } catch (error) {
      console.error('Error submitting form response:', error);
      // Handle error (e.g., display error message to the user)
    }
  };
  

  const renderInput = (question, questionIndex) => {
    if (!showQuestions) return null;

    if (question.answerType === 'text') {
      return (
        <TextInput
          style={styles.input}
          placeholder="Type your answer"
          onChangeText={(text) => handleTextInputChange(text, questionIndex)}
        />
      );
    } else if (question.answerType === 'multipleChoice') {
      return (
        <View>
          {question.options.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.radioButton}>
              <RadioButton.Android
                value={option} // Use optionIndex as the value
                status={formResponses[questionIndex] && formResponses[questionIndex].value === option ? 'checked' : 'unchecked'}
                onPress={() => handleSelectOption(questionIndex, optionIndex, option)}
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

  return (
    <View style={styles.container}>
      {!showQuestions && !showSuccessMessage && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            value={emailId}
            onChangeText={setEmailId}
          />
          <TextInput
            style={styles.input}
            placeholder="Registration Number"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Serial Number"
            value={serialNumber}
            onChangeText={setSerialNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Section"
            value={section}
            onChangeText={setSection}
          />
          <Pressable style={styles.nextButton} onPress={handleSubmitDetails}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </>
      )}

      {showQuestions && !showSuccessMessage && (
        <>
          <Text style={styles.formName}>{formStructure.formName}</Text>

          {formStructure.questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.question}</Text>
              {renderInput(question, index)}
            </View>
          ))}

          <Pressable style={styles.addButton} onPress={handleSubmitForm}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </>
      )}

      {showSuccessMessage && (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessageText}>Form response submitted successfully!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  formName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
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
  addButton: {
    backgroundColor: '#FEBE10',
    borderRadius: 30,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginHorizontal: 30,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginHorizontal: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successMessageContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  successMessageText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormSubmission;
