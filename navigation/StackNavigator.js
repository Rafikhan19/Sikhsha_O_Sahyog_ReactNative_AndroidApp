import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FormScreen from '../screens/FormScreen';
import AssignmentManageScreen from '../screens/AssignmentManageScreen';
import FormCreation from '../screens/FormCreation';
import Form from '../screens/Form';
import CustomTabBar from '../components/CustomTabBar';
import CreateClassroom from '../screens/CreateClassroom';
import FormSubmission from '../screens/FormSubmission';
import StudentSubmissons from '../screens/StudentSubmissons';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} >
      <Tab.Screen
        name="Dashboard"
        component={CreateClassroom}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIconName: 'home',
          headerShown:false,
        }}
        
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIconName: 'person',
          headerShown:false,
        }}
      />
      <Tab.Screen
        name="Forms"
        component={FormScreen}
        options={{
          tabBarLabel: 'Forms',
          tabBarIconName: 'create',
          headerShown:false,
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AssignmentManage" component={AssignmentManageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FormCreation" component={FormCreation} options={{ headerShown: false }} />
        <Stack.Screen name="Form" component={Form} options={{ headerShown: false }} />
        <Stack.Screen name="FormSubmission" component={FormSubmission} options={{ headerShown: false }} />
        <Stack.Screen name="StudentSubmission" component={StudentSubmissons} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
