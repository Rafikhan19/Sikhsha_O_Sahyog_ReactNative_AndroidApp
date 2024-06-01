import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Pressable, Modal, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
const AssignmentManageScreen = ({ route }) => {
  const navigation = useNavigation();
  const { createdby, year, subject, branch, section, item } = route.params;

  const [sl, setSl] = useState('');
  const [reg, setReg] = useState('');
  const [due, setDue] = useState('');
  const [submit, setSubmit] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [studentDetails, setStudentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(null);

  const [editedDue, setEditedDue] = useState('');
  const [editedSubmit, setEditedSubmit] = useState('');

  // Function to handle edit button press
  const handleEdit = (index) => {
    setIsEditing(isEditing === index ? null : index);
  };


  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.125.159:8000/getStudents', {
        params: { createdby, year, subject, branch, section }
      });

      if (response.data && response.data.studentDetails) {
        setStudentDetails(response.data.studentDetails);
      } else {
        setStudentDetails([]);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [createdby, year, subject, branch, section]);

  const handleRegister = () => {
    console.log(createdby)

    const studentData = {
      serialNo: sl,
      registrationNumber: reg,
      dueAssignments: due,
      submittedAssignments: submit
    };

    axios.post("http://192.168.125.159:8000/addStudent", { createdby, year, subject, branch, section, studentData })
      .then((response) => {

        Alert.alert(
          "Success",
          "Details added successfully"
        );
        fetchData()
        // Add submitted data to the list
        setSl("");
        setReg("");
        setDue("");
        setSubmit("");
        setModalVisible(false); // Close the modal
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "An error occurred while adding details"
        );
        console.error("Registration failed", error);
      });
  };

  const handleChangeData = (index) => {
    const updatedStudentDetails = [...studentDetails];
    updatedStudentDetails[index].dueAssignments = editedDue;
    updatedStudentDetails[index].submittedAssignments = editedSubmit;
    setStudentDetails(updatedStudentDetails);
    setIsEditing(null); // Reset editing state
    // Send updated data to the backend API to save changes
    axios.put(`http://192.168.125.159:8000/updateStudent/${createdby}/${year}/${subject}/${branch}/${section}/${updatedStudentDetails[index].registrationNumber}`, {
      dueAssignments: editedDue,
      submittedAssignments: editedSubmit
    }).then((response) => {

      Alert.alert("Success", "Details updated successfully");
    }).catch((error) => {

      Alert.alert("Error", "An error occurred while updating details");
    });
  };

  const deleteClassroom = () => {


    const classroomData = {
      createdby: createdby,
      year: year,
      subject: subject,
      branch: branch,
      section: section
    };

    axios.delete("http://192.168.125.159:8000/classroomDelete", { data: classroomData })
      .then((response) => {
        Alert.alert(
          "Success",
          "Deleted successfully"
        );
        navigation.navigate("main"); // Close the modal
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "An error occurred while deleting"
        );
        console.error("Deletion failed", error);
      });
  };


  const deleteStudent = async (registrationNumber) => {
    try {
      await axios.delete('http://192.168.125.159:8000/deleteStudent', {
        data: {
          createdby: createdby,
          year: year,
          subject: subject,
          branch: branch,
          section: section,
          registrationNumber: registrationNumber
        }
      });
      // Refresh the student details after deletion
      await fetchData();
      Alert.alert('Success', 'Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', 'An error occurred while deleting the student');
    }
  };

  return (


    <View style={styles.container}>
     <View style={{ flexDirection: "row", alignSelf: "flex-start", padding: 10, width: "100%", borderBottomEndRadius: 10, borderTopLeftRadius: 10 }}>
  <Text style={[styles.heading,{fontSize:30,paddingRight:5}]}>
    {subject}  
  </Text>
  <Text style={styles.heading}>
      {section} -
  </Text>
  <Text style={styles.heading}>
     {year}-
  </Text>
  <Text style={styles.heading}>
     {branch}
  </Text>
  <Pressable onPress={() => deleteClassroom()} style={{ marginLeft: 'auto' }}>
    <MaterialIcons name="delete-forever" size={30} color="red" />
  </Pressable>
</View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Details</Text>
            <TextInput
              value={sl}
              onChangeText={(text) => setSl(text)}
              style={styles.input}
              placeholder="Enter your serial"
            />
            <TextInput
              value={reg}
              onChangeText={(text) => setReg(text)}
              style={styles.input}
              placeholder="Enter your reg. No"
            />
            <TextInput
              value={due}
              onChangeText={(text) => setDue(text)}
              style={styles.input}
              placeholder="Enter due Assmnt"
            />
            <TextInput
              value={submit}
              onChangeText={setSubmit}
              style={styles.input}
              placeholder="Enter submitted assmnt"
            />
            <Pressable
              onPress={handleRegister}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.plusButton}
      >
        <AntDesign name="plus" size={24} color="black" />
      </Pressable>
    
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : studentDetails.length > 0 ? (
        <View style={{ flex: 1, padding: 15 }}>

        {studentDetails.map((student, index) => (
  <View key={index} style={styles.StudentContainer}>
    <Text style={styles.slNoText}>Sl No: {student.serialNo}</Text>
    <Pressable style={styles.regNoPressable}>
      <Text style={styles.regNoText}>Reg. No: {student.registrationNumber}</Text>
    </Pressable>
    <Pressable onPress={() => deleteStudent(student.registrationNumber)} style={styles.deletePressable}>
      <AntDesign name="delete" size={24} color="red" />
    </Pressable>
    <TextInput
      editable={isEditing === index}
      style={styles.submitTextInput}
      value={isEditing === index ? editedSubmit : student.submittedAssignments.toString()}
      onChangeText={text => setEditedSubmit(text)}
    />
    <TextInput
      editable={isEditing === index}
      style={styles.dueTextInput}
      value={isEditing === index ? editedDue : student.dueAssignments.toString()}
      onChangeText={text => setEditedDue(text)}
    />
    <Pressable onPress={() => isEditing === index ? handleChangeData(index) : handleEdit(index)} style={styles.editPressable}>
      <Text>{isEditing === index ? <AntDesign name="checkcircleo" size={24} color="black" /> : <FontAwesome6 name="edit" size={24} color="black" />}</Text>
    </Pressable>
   
  </View>
))}
        </View>
      ) : (
        <Text style={{ justifyContent: "center", textAlign: "center", fontSize: 30, opacity: 0.3, marginVertical: 50, paddingHorizontal: 40,color:"white" }}>No student details found  Add details</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07143F',
    alignItems: 'center',
    marginTop: 50,
  },
  
    heading: {
      fontWeight: "bold",
      textTransform: "uppercase",
      color: "white",
      fontSize:20,
      paddingHorizontal:1
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
    width:"70%"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#07143F"
  },
  input: {
    height: 40,
    borderBottomWidth:1,
    
    borderColor: 'gray',
    
    paddingHorizontal:5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#FEBE10',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FEBE10',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },


  StudentContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderRadius:30,
    height:150,
    backgroundColor: "#ECF9FC",
    padding:20
  },
  slNoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "black",
    fontSize:18
  },
  regNoPressable: {
    padding: 10,
    // backgroundColor:"#FAB440",
    borderRadius: 25,
    marginRight: 15
  },
  regNoText: {
    color: "black",
    textTransform: "capitalize",
    fontSize: 16,
   
  },
  editPressable: {
    marginLeft: 30
  },
  submitTextInput: {
    padding: 10,
    width: 70,
    color: "black",
    backgroundColor: "#90EE90",
    borderRadius: 25,
    marginLeft: 95,
    marginVertical: 10,
    justifyContent: "center",
    textAlign: "center",
    fontSize:18
  },
  dueTextInput: {
    padding: 10,
    width: 70,
    color: "black",
    fontSize:18,
    backgroundColor: "#ff6443",
    borderRadius: 25,
    justifyContent: "center",
    textAlign: "center"
  },
  deletePressable: {
    padding: 10,
    marginLeft: 10
  }
});

export default AssignmentManageScreen;
