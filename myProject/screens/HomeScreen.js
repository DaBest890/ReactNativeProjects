import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import GlobalStyles from '../styles/GlobalStyles';
import { CurrencyContext } from '../context/CurrencyContext';
import { Audio } from 'expo-av'; // For audio sounds

const HomeScreen = () => {
  const { currency, spendCurrency, resetCurrency, saveCurrencyAsBaseline } = useContext(CurrencyContext);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);
  const cashRegisterSoundRef = useRef(null);

  useEffect(() => {
    async function setupPurchaseSound() {
      try {
        console.log('Setting up purchase sound...');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false,
        });

        if (cashRegisterSoundRef.current) {
          console.log('Unloading previous sound...');
          await cashRegisterSoundRef.current.unloadAsync();
        }

        cashRegisterSoundRef.current = new Audio.Sound();
        console.log('Loading cash register sound...');
        await cashRegisterSoundRef.current.loadAsync(
          require('../assets/sounds/cashregisterpurchase.mp3'),
          { shouldPlay: false }
        );

        console.log('Cash register sound loaded successfully.');
      } catch (error) {
        console.error('Error setting up purchase sound:', error);
      }
    }

    setupPurchaseSound();

    return () => {
      if (cashRegisterSoundRef.current) {
        console.log('Unloading cash register sound on unmount...');
        cashRegisterSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const playPurchaseSound = async () => {
    if (cashRegisterSoundRef.current) {
      try {
        console.log('Attempting to play purchase sound...');
        await cashRegisterSoundRef.current.setPositionAsync(0);
        await cashRegisterSoundRef.current.playAsync();
        console.log('Cash register sound played successfully.');
      } catch (error) {
        console.error('Error playing cash register sound:', error);
      }
    } else {
      console.error('Error: Sound reference is null, sound not loaded.');
    }
  };

  const handlePurchase = (amount) => {
    console.log(`Attempting to purchase item for ${amount} Dad Dollars...`);
    saveCurrencyAsBaseline();
    spendCurrency(amount);
    playPurchaseSound();
    setShowPaymentAnimation(true);
    setTimeout(() => setShowPaymentAnimation(false), 2000);
  };

  return (
    <View style={[GlobalStyles.container, styles.containerOverride]}>
      <Text style={styles.title}>Dad Dollars: {currency}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={GlobalStyles.button} onPress={() => handlePurchase(240)}>
          <Text style={GlobalStyles.buttonText}>New Game: 240</Text>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.button} onPress={() => handlePurchase(10)}>
          <Text style={GlobalStyles.buttonText}>New Book: 10</Text>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.button} onPress={() => handlePurchase(60)}>
          <Text style={GlobalStyles.buttonText}>New Gun: 60</Text>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.button} onPress={() => handlePurchase(120)}>
          <Text style={GlobalStyles.buttonText}>New Plushie Toy: 120</Text>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.button} onPress={() => handlePurchase(240)}>
          <Text style={GlobalStyles.buttonText}>New Clothes: 240</Text>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.button} onPress={() => handlePurchase(30)}>
          <Text style={GlobalStyles.buttonText}>30 More Minutes: 30</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.resetButtonContainer}>
          <TouchableOpacity style={GlobalStyles.button} onPress={resetCurrency}>
            <Text style={GlobalStyles.buttonText}>Reset Currency</Text>
          </TouchableOpacity>
        </View>

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
