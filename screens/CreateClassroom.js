import React, { useEffect, useState, useRef } from 'react';
import { TextInput, StyleSheet, Alert, View, FlatList, Image, Dimensions, Pressable, Text, ScrollView } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get("window")
import { useNavigation } from "@react-navigation/native";
import StudentDashboard from './StudentDashboard';

const images = [

  require("../assets/campus.jpg"),
  require("../assets/class.jpg"),
  require("../assets/assignmentpic.jpg"),
  require("../assets/Checklist.jpg"),

];

const CreateClassroom = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigation = useNavigation();
  const [classroomInfo, setClassroomInfo] = useState({

    year: '',
    branch: '',
    section: '',
    subject: '',

  });




  const handleGetUserInfo = async () => {
    const token = await AsyncStorage.getItem("authToken");



    try {
      const response = await axios.post('http://192.168.125.159:8000/user-info', { token });
      //  const {email} =response.data.user;
      //  setUserInfo(email);
      const useri = response.data.user;
      setUserInfo(useri)



    } catch (error) {

      setUserInfo(null);
    }
  };

  useEffect(() => {
    handleGetUserInfo();
  }, [userInfo]);



  const soaEmailRegex = /^[a-zA-Z0-9._%+-]+@soa.ac.in$/;
  const checkEmail = soaEmailRegex.test(userInfo?.email)

  useEffect(() => {



    const fetchClassrooms = async () => {

      const username = userInfo?.email
      try {
        const response = await axios.get(`http://192.168.125.159:8000/createdClassrooms/${username}`);
        setClassrooms(response.data.classrooms);
      } catch (error) {
        setClassrooms(null)
      }
    };

    if (userInfo?.email) {
      fetchClassrooms();
    }
  }, [userInfo]);


  const handleCreateClassroom = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  }

  const handleSubmit = () => {


    const classroomData = {
      ...classroomInfo,
      createdby: userInfo.email // Assuming the user object contains the name of the logged-in user
    };

    axios.post("http://192.168.125.159:8000/classrooms", classroomData)
      .then((response) => {

        Alert.alert("Classroom created successfully 🎉");
        setClassroomInfo({});
        setShowForm(false)

      })
      .catch((error) => {
        console.error("Classroom creation error:", error);
        Alert.alert("Classroom creation error 😞");
      });
  };




  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex === images.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }, 2000); // Change the interval time as needed

    return () => clearInterval(scrollInterval);
  }, [currentIndex]);



  return (
    <>
      {checkEmail ? (
        <>
          {!showForm ? (

          
            <SafeAreaView style={styles.container}>
            <ScrollView >
            <View style={{ height: height / 3, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
  <FlatList
    ref={flatListRef}
    data={images}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <View
        style={{
          width,
          height: height / 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={item}
          style={{
            width: '90%',
            height: '90%',
            borderRadius: 10,
          }}
        />
      </View>
    )}
    initialScrollIndex={currentIndex}
    getItemLayout={(data, index) => ({
      length: width,
      offset: width * index,
      index,
    })}
  />
</View>

              <Pressable
                onPress={handleCreateClassroom}
                style={{
                  width: 200,
                  backgroundColor: "#BAE5F4",
                  borderRadius: 6,
                  marginTop: 20,
                  marginHorizontal:"25%",
                  padding: 15,

                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#032030",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Create Classroom
                </Text>
              </Pressable>
             
              <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", alignSelf: "flex-start", marginTop: "7%", color: "#ECF9FC" }}>Your Created Classrooms</Text>
              
              <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  
  }}
>
  {classrooms &&
    classrooms?.map((item, index) => (
      <Pressable
        onPress={() =>
          navigation.navigate("AssignmentManage", {
            createdby: item?.createdby,
            year: item.year,
            subject: item.subject,
            branch: item.branch,
            section: item.section,
            item: item
          })
        }
        key={item._id || index.toString()}
        style={{
          marginVertical: 10,
          marginHorizontal: 15,
          flexDirection: "column",
          borderRadius: 15,
          padding: 12,
          alignItems: "center",
          backgroundColor: "#4E47C6",
          height: 170,
          elevation:6, // Add elevation for box shadow
          shadowColor: "#07143F", // Shadow color
          shadowOffset: { width: 0, height: 12 }, // Shadow offset
          shadowOpacity: 0.3, // Shadow opacity
          shadowRadius: 4, // Shadow radius
        }}
      >
        <Text style={[styles.classroomText, { fontSize: 30 }]}>
          {item.subject}
        </Text>
        <Text style={styles.classroomText}>{item.branch}</Text>
        <Text style={styles.classroomText}>Sec: {item.section}</Text>
        <Text style={styles.classroomText}>Year: {item.year}</Text>
      </Pressable>
    ))}
</View>

              </ScrollView>

            </SafeAreaView>



          ) : (
            <View style={styles.container}>
              <View style={styles.formContainer}>
                <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", alignSelf: "center", marginTop: "7%", color: "#404040" }}>Create your Classroom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Year"
                  value={classroomInfo.year}
                  onChangeText={(text) => setClassroomInfo({ ...classroomInfo, year: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Branch"
                  value={classroomInfo.branch}
                  onChangeText={(text) => setClassroomInfo({ ...classroomInfo, branch: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Section"
                  value={classroomInfo.section}
                  onChangeText={(text) => setClassroomInfo({ ...classroomInfo, section: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Subject"
                  value={classroomInfo.subject}
                  onChangeText={(text) => setClassroomInfo({ ...classroomInfo, subject: text })}
                />

                <View style={styles.buttonContainer}>
                  <Pressable
                    onPress={handleSubmit}
                    style={styles.submitButton}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleBack}
                  >
                    <MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </>
      ) : (
        <>

          <StudentDashboard />
        </>
      )}
    </>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "3%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#032030"

  },
  classroomText: {
    width: 150,
    // height: 30,
    color: "white",
    textAlign: "left",
    textTransform: "capitalize",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal:5,
    paddingVertical:2
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#e5efef',
    padding: 20,
    borderRadius: 10,
    marginVertical: "50%"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  submitButton: {
    width: 100,
    backgroundColor: '#FEBE10',
    borderRadius: 6,
    padding: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default CreateClassroom;

