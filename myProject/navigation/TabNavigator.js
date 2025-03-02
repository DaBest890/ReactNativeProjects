import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import TaskManagerScreen from '../screens/TaskManagerScreen';
import { CurrencyProvider } from '../context/CurrencyContext';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <CurrencyProvider>
     <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
           tabBarIcon: ({ color, size }) => {
             const iconMap = {
                Home: "home",
               Settings: "settings",
                Profile: "person-circle",
                "Task Manager": "list", // Using the 'list' icon for Task Manager
             };

             return <Ionicons name={iconMap[route.name] || "help-circle"} size={size} color={color} />;
          },
           tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}
        >
         <Tab.Screen name="Home" component={HomeScreen} />
         <Tab.Screen name="Settings" component={SettingsScreen} />
         <Tab.Screen name="Profile" component={ProfileScreen} />
         <Tab.Screen name="Task Manager" component={TaskManagerScreen} />
       </Tab.Navigator>
     </NavigationContainer>
    </CurrencyProvider>
  );
};

export default TabNavigator;
