import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.tabItemFocused]}
          >
            <Ionicons name={options.tabBarIconName} size={24} color={isFocused ? '#4E47C6' : '#008E97'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#ECF9FC',
      borderTopLeftRadius: 20, // Adjust the value as needed
      borderTopRightRadius: 20, // Adjust the value as needed
      overflow: 'hidden', // Ensure content is clipped within the rounded borders
      height: 60,
      paddingTop: 10, // Adjust as needed
      paddingHorizontal: 10,
  },
  tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  tabItemFocused: {
      borderRadius: 12,
      width: 20,
  },
});

  
export default CustomTabBar;
