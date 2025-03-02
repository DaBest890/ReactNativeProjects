import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F8F9FA',
    },
    button: {
        backgroundColor: '#B08D57',  // Updated to the color you want
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    text: {
      fontSize: 16,
      color: '#333',
    },
    // Other global styles...
  });
  
  export default GlobalStyles;