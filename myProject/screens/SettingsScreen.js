import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles'; // Correctly imported GlobalStyles

export default function SettingsScreen() {
  return (
    <View style={GlobalStyles.container}> {/* Applying container style from GlobalStyles */}
      <Text style={GlobalStyles.title}>Welcome to the New Screen</Text> {/* Applying title style */}
      <Text style={GlobalStyles.text}>This is a new screen with global styles applied.</Text> {/* Applying text style */}
      <TouchableOpacity style={GlobalStyles.button}>
        <Text style={GlobalStyles.buttonText}>Press Me</Text> {/* Applying button style */}
      </TouchableOpacity>
    </View>
  );
}
