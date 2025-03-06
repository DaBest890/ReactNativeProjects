import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import GlobalStyles from '../styles/GlobalStyles';
import { CurrencyContext } from '../context/CurrencyContext';
import { Audio } from 'expo-av'; // For audio sounds

// ==================================================================
// HomeScreen Component: Main screen layout for your Home screen.
// ==================================================================
const HomeScreen = () => {
  // Destructure currency functions from CurrencyContext (including the baseline saver)
  const { currency, spendCurrency, resetCurrency, saveCurrencyAsBaseline } = useContext(CurrencyContext);
  // State to control showing the payment animation
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);

  // ====================================================================
  // 1) Creating a reference for the purchase sound
  // ====================================================================
  const cashRegisterSoundRef = useRef(null);

  // =================================
  // 2) Loading the sound in a useEffect hook
  // ==================================
  useEffect(() =>{
    async function setupPurchaseSound() {
      try{
        // setting audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false,
        });
        // Unload if there's a previous sound loaded
        if (cashRegisterSoundRef.current) {
          await cashRegisterSoundRef.current.unloadAsync();
        }
        // Create a new Sound instance and load the cash register sound
        cashRegisterSoundRef.current = new Audio.Sound();
        await cashRegisterSoundRef.current.loadAsync(
          require('../assets/sounds/cashregisterpurchase.mp3'),
          { shouldPlay: false }
        );
          // Debugging purposes
        console.log('Cash register sound loaded successfully');
      } catch (error) {
        console.error('Error setting up purchase sound:', error);
      }
    }

    setupPurchaseSound();

    // Cleanup function to unload sound when component unmounts
    return () => {
      if (cashRegisterSoundRef.current) {
        cashRegisterSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const playPurchaseSound = async () => {
    if (cashRegisterSoundRef.current) {
      try {
        await cashRegisterSoundRef.current.setPositionAsync(0);
        await cashRegisterSoundRef.current.playAsync();
        console.log('Cash register sound played');
      } catch (error) {
        console.error('Error playing cash register sound:', error);
      }
    }
  };

  // Handler for purchase actions that displays the payment animation
  const handlePurchase = (amount) => {
    // Save the current currency as the baseline before spending
    saveCurrencyAsBaseline();
    // Spend the currency
    spendCurrency(amount);
    // Play the purchase sound
    playPurchaseSound();
    // Show the payment animation
    setShowPaymentAnimation(true);
    // Hide the animation after 2 seconds (adjust as needed)
    setTimeout(() => setShowPaymentAnimation(false), 2000);
  };

  return (
    // Main container: using global container style for consistent padding and background
    <View style={[GlobalStyles.container, styles.containerOverride]}>
      
      {/* Currency Display */}
      <Text style={styles.title}>Dad Dollars: {currency}</Text>
      
      {/* Button container for purchases */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={() => handlePurchase(240)}
        >
          <Text style={GlobalStyles.buttonText}>New Game: 240</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={() => handlePurchase(10)}
        >
          <Text style={GlobalStyles.buttonText}>New Book: 10</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={() => handlePurchase(60)}
        >
          <Text style={GlobalStyles.buttonText}>New Gun: 60</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={() => handlePurchase(120)}
        >
          <Text style={GlobalStyles.buttonText}>New Plushie Toy: 120</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={GlobalStyles.button} 
          onPress={() => handlePurchase(240)}
        >
          <Text style={GlobalStyles.buttonText}>New Clothes: 240</Text>
        </TouchableOpacity>
      </View>
      
      {/* Optional manual reset button (currently shown in dev mode) */}
      {__DEV__ && (
        <View style={styles.resetButtonContainer}>
          <TouchableOpacity style={GlobalStyles.button} onPress={resetCurrency}>
            <Text style={GlobalStyles.buttonText}>Reset Currency</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Payment Animation Overlay */}
      {showPaymentAnimation && (
        <View style={styles.paymentAnimationContainer}>
          <LottieView
            source={require('../assets/animations/payment/paymentani/paymentani.json')}
            autoPlay
            loop={false}
            style={styles.paymentAnimation}
          />
        </View>
      )}
    </View>
  );
};

// ==================================================================
// Local Styles: Specific styles for HomeScreen to further customize layout
// ==================================================================
const styles = StyleSheet.create({
  containerOverride: {
    flex: 1,
    padding: 20,
    margin: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'DynaPuff-Bold',
    color: '#333',
    fontSize: 40,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 20,
    gap: 16,
  },
  resetButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // Payment animation container: an overlay that centers the animation
  paymentAnimationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paymentAnimation: {
    width: 200,
    height: 200,
  },
});

export default HomeScreen;
