import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Import Axios
import { useNavigation } from "@react-navigation/native"

const FormCreation = ({ route }) => {

  const { createdby } = route.params;
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [formName, setFormName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answerType, setAnswerType] = useState('text');
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState('');
  const [showOptionInput, setShowOptionInput] = useState(false);
  const [iconName, setIconName] = useState('add-circle-outline');

  const addQuestion = () => {
    if (currentQuestion.trim() !== '') {
      if (answerType === 'multipleChoice' && options.length === 0) {
        return;
      }
      setQuestions([...questions, { question: currentQuestion, answerType, options }]);
      setCurrentQuestion('');
      setOptions([]);
      setCurrentOption('');
      setShowOptionInput(false); // Hide option input after adding question
      setIconName('add-circle-outline'); // Reset icon after adding question
    }
  };

  const addOption = () => {
    if (answerType === 'multipleChoice' && currentOption.trim() !== '') {
      setOptions([...options, currentOption]);
      setCurrentOption('');
      setIconName('checkmark-circle-outline'); // Change icon to checkmark after adding option
    }
  };

  const saveForm = async () => {
    try {
      console.log(createdby);
      await axios.post('http://192.168.125.159:8000/createForm', {
        createdBy: createdby,
        formName: formName,// Assuming 'createdBy' should be a string
        formStructure: { questions }
      });
      Alert.alert("SuccessFully created your form")
      // Reset form or navigate to another screen
      setFormName(" ")
      setQuestions([]);
      navigation.navigate("main")

    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  return (
    <View style={{ marginTop: 50, padding: 20 }}>
      <View>
        <TextInput
          placeholder="Enter your Form name"
          value={formName}
          onChangeText={setFormName}
          style={{ fontSize: 16, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Enter your question"
          value={currentQuestion}
          onChangeText={setCurrentQuestion}
          style={{ fontSize: 16, marginBottom: 10 }}
        />
        {showOptionInput && (
          <View>
            <TextInput
              placeholder="Enter option"
              value={currentOption}
              onChangeText={setCurrentOption}
              style={{ fontSize: 16, marginBottom: 10 }}
            />
            <Pressable onPress={addOption}>
              <Ionicons name={iconName} size={24} color="black" />
            </Pressable>
          </View>
        )}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Pressable
            onPress={() => {
              setAnswerType('text');
              setShowOptionInput(false); // Hide option input when switching to text
            }}
            style={{
              backgroundColor: answerType === 'text' ? '#97A97C' : 'white',
              borderWidth: 1,
              borderColor: answerType === 'text' ? '#97A97C' : 'white',
              borderRadius: 6,
              padding: 15,
              width: 160,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: answerType === 'text' ? 'white' : '#97A97C',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Text
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setAnswerType('multipleChoice');
              setShowOptionInput(true); // Show option input when switching to multiple choice
            }}
            style={{
              backgroundColor: answerType === 'multipleChoice' ? '#97A97C' : 'white',
              borderWidth: 1,
              borderColor: answerType === 'multipleChoice' ? '#97A97C' : 'white',
              borderRadius: 6,
              padding: 15,
              width: 160,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: answerType === 'multipleChoice' ? 'white' : '#97A97C',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Multiple Choice
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={addQuestion}
          style={{
            width: '100%',
            backgroundColor: '#FEBE10',
            borderRadius: 6,
            padding: 15,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Add Question
          </Text>
        </Pressable>
      </View>

      <View>
        {questions.map((q, index) => (
          <View key={index} style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 12 }}>{index + 1}. {q.question}</Text>
            {q.answerType === 'multipleChoice' ? null : <Text>{q.answerType}</Text>}
            {q.options && q.options.map((option, optionIndex) => (
              <Text key={optionIndex} style={{ fontSize: 12, justifyContent: "center" }}>
                <Ionicons name="radio-button-off" size={20} color="black" /> {option}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <Pressable
        onPress={saveForm}
        style={{
          width: '100%',
          backgroundColor: '#90EE90',
          borderRadius: 6,
          padding: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Save Form
        </Text>
      </Pressable>
    </View>
  );
};

export default FormCreation;