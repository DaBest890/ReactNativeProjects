import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Import global reusable styles
import GlobalStyles from '../styles/GlobalStyles';
import { CurrencyContext } from '../context/CurrencyContext';


// ==================================================================
// HomeScreen Component: Main screen layout for your Home screen.
// ==================================================================
const HomeScreen = () => {
  // Destructure currency from the CurrencyContext
  const { currency, spendCurrency, resetCurrency } = useContext(CurrencyContext);

  return (
    // Main container: using global container style for consistent padding and background
    <View style={[GlobalStyles.container, styles.containerOverride]}>
      
      {/* Header Text: Displays the screen title using local style overrides if needed */}
      <Text style={styles.title}>Currency: {currency}</Text>
      
      {/* Button container: flex row, spaced apart */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={() => spendCurrency(240)}
        >
          <Text style={GlobalStyles.buttonText}>New Game: 240</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={() => spendCurrency(10)}
        >
          <Text style={GlobalStyles.buttonText}>New Book: 10</Text>
        </TouchableOpacity>

      </View>
   {/*  {__DEV__ && (
      <View style={styles.resetButtonContainer}>

      <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={resetCurrency}
        >
          <Text style={GlobalStyles.buttonText}>Reset</Text>
        </TouchableOpacity>
        </View>
    )}
    */}
      
      {/* Additional blocks can be added here. For instance, you could add buttons, images, or other components */}
    </View>
  );
};

// ==================================================================
// Local Styles: Specific styles for HomeScreen to further customize layout
// ==================================================================
const styles = StyleSheet.create({
  // Optional override for container if you need to adjust GlobalStyles.container
  containerOverride: {
    flex: 1,
    padding: 20,            // Add some padding inside the container
    margin: 10,             // Optional: margin outside the container
    alignItems: 'center',     // Center items horizontally
    // Here you can add any additional styling for the container specific to HomeScreen
  },
  title: {
    // Local title style: larger and bold text for the header
    fontSize: 28,
    marginBottom: 10, // Adds spacing below the title
    fontFamily: 'DynaPuff-Bold',
    color: '#333',
    fontSize: 50,
  },
  subtitle: {
    // Local subtitle style: smaller text with a muted color
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'column',    // Lay out buttons side by side
    justifyContent: 'space-between',
    width: '50%',            // Optional: set a width to control button alignment
    marginTop: 20,
    gap: 16,
  },
  resetButtonContainer: {
    position: 'absolute', // Distance from the bottom edge
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center', // Centers horizontally

  }
});

export default HomeScreen;
