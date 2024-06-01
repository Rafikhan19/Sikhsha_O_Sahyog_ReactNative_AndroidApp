import { View, Text, StyleSheet, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from "@expo/vector-icons";
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from "@react-navigation/native"
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage"
// import jwtDecode from 'jwt-decode'
const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        // const decodedToken = jwtDecode(token);
        // const userId = decodedToken.userId;
        // console.log(userId);
        if (token) {
          navigation.replace("main");
        }
      } catch (err) {
        console.log("error message", err);
      }
    };
    checkLoginStatus();
  }, []);
  const handleLogin = () => {
    
    const user = {
      email: email,
      password: password,
    };
    axios
      .post("http://192.168.125.159:8000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        Alert.alert("Login successfull", "valid Email");
        navigation.navigate("main");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid Email");
        console.log(error);
      });

  }
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
            Login to your Account
          </Text>
        </View>
        <View style={{ marginTop: 40 }}>
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

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>

          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>
        <View style={{ marginTop: 80 }} />
        <Pressable
          onPress={handleLogin}
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
            Login
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "#007fff", fontSize: 16 }}>
            Don't have an account? Sign Up
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

export default LoginScreen