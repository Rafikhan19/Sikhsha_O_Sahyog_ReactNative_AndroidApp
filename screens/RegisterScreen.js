import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { responsiveHeight } from 'react-native-responsive-dimensions';
import axios from "axios"
const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();


  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    // send a POST  request to the backend API to register the user
    axios.post("http://192.168.125.159:8000/register", user)
      .then((response) => {
        // console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered Successfully"
        );
        navigation.replace("Login")
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An error occurred while registering"
        );
        console.log("registration failed", error);
      });
  };

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center", marginTop: 50 }}>
      <View >
        <Image
          style={{ width: 300, height: 120, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
          source={require("../assets/banner.jpg")}
        />
      </View>
      <KeyboardAvoidingView>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 17,
              color: "#041E42",
            }}
          >
            Register to your Account
          </Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 30,
          }}>
            <Feather name="user" size={24} color="grey" style={{ marginLeft: 8 }} />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="enter your name" />

          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 30,
          }}>
            <MaterialIcons style={{ marginLeft: 8 }} name='email' size={24} color="grey" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="enter your Email" />

          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="enter your Password"
            />
          </View>
        </View>


        <View style={{ marginTop: 80 }} />
        <Pressable
          onPress={handleRegister}
          style={{
            width: 150,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,

          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Sign Up
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "#007fff", fontSize: 16 }}>
            Already have an account? Login
          </Text>
        </Pressable>

      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
    marginTop: 0
  },
  topView: {
    height: responsiveHeight(30),
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

    marginBottom: 20,
    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 110,
  },

});
export default RegisterScreen