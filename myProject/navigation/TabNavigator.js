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
          // Define the icon for each tab based on the route name.
            tabBarIcon: ({ color, size }) => {
            // Map each route to a specific Ionicons icon name.
              const iconMap = {
                Home: "home",               // Home screen icon
                Settings: "settings",       // Settings screen icon
                Profile: "person-circle",   // Profile screen icon
                "Task Manager": "list",     // Task Manager screen icon (using 'list' icon)
              };

              // Return an Ionicons component with the mapped icon name,
              // falling back to 'help-circle' if the route name isn't found in iconMap.
              return <Ionicons name={iconMap[route.name] || "help-circle"} size={size} color={color} />;
            },
            // Set the tint color for the active tab icons.
            tabBarActiveTintColor: 'blue',
            // Set the tint color for the inactive tab icons.
            tabBarInactiveTintColor: 'gray',

            // ------------------- Header Options for All Screens -------------------
            // Center the header title for each screen.
            headerTitleAlign: 'center',
            // Set the header's background color.
            headerStyle: { backgroundColor: '#f2f2f2' },
            // Customize the header title's style (bold font and larger size).
            headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
            // Set the color for header elements such as the back button.
            headerTintColor: '#000',
          })}>

         <Tab.Screen name="Home" component={HomeScreen} />
         <Tab.Screen name="Settings" component={SettingsScreen} />
         <Tab.Screen name="Profile" component={ProfileScreen} />
         <Tab.Screen name="Task Manager" component={TaskManagerScreen}/>
       </Tab.Navigator>
     </NavigationContainer>
    </CurrencyProvider>
  );
};

export default TabNavigator;
