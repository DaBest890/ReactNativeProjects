import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(0);
  const [multiplier, setMultiplier] = useState(1); // Multiplier for rewards

  // Load the baseline (saved) currency when the provider mounts
  useEffect(() => {
    const loadBaselineCurrency = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem('savedCurrency');
        if (savedCurrency !== null) {
          // Use the saved baseline as our starting value
          const parsedCurrency = JSON.parse(savedCurrency);
          setCurrency(parsedCurrency);
        } else {
          // If no baseline exists, initialize it with default 0
          await AsyncStorage.setItem('savedCurrency', JSON.stringify(0));
        }
      } catch (error) {
        console.error('Error loading saved baseline currency:', error);
      }
    };
    loadBaselineCurrency();
  }, []);

  // This function rewards currency and updates the current value.
  // It also updates the baseline (savedCurrency) so that the reset reverts to this new value.
  const rewardCurrency = () => {
    setCurrency(prevCurrency => {
      const newCurrency = prevCurrency + (10 * multiplier);
      // Update both the current currency and the baseline
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
      AsyncStorage.setItem('savedCurrency', JSON.stringify(newCurrency));
      return newCurrency;
    });
  };

  // This function spends currency and updates the current value only.
  // It does NOT update the saved baseline.
  const spendCurrency = (amount) => {
    setCurrency(prevCurrency => {
      const newCurrency = Math.max(0, prevCurrency - amount);
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
      return newCurrency;
    });
  };

  // Updated resetCurrency: reverts to the last known (baseline) currency value.
  const resetCurrency = async () => {
    try {
      // Retrieve the baseline currency from AsyncStorage using the 'savedCurrency' key
      const savedCurrency = await AsyncStorage.getItem('savedCurrency');
      const baselineCurrency = savedCurrency !== null ? JSON.parse(savedCurrency) : 0;
      setCurrency(baselineCurrency);
      // Optionally update the 'currency' key as well
      AsyncStorage.setItem('currency', JSON.stringify(baselineCurrency));
    } catch (error) {
      console.error('Error resetting currency:', error);
    }
  };

  // Allows updating the reward multiplier
  const setRewardMultiplier = (value) => {
    setMultiplier(value);
  };

  // Optionally, a helper function to update the baseline value manually.
  // For example, after a level up, you might want to "save" the current currency as the new baseline.
  const saveCurrencyAsBaseline = async () => {
    try {
      await AsyncStorage.setItem('savedCurrency', JSON.stringify(currency));
    } catch (error) {
      console.error('Error saving baseline currency:', error);
    }
  };

  // Keep the current currency stored in AsyncStorage whenever it changes.
  useEffect(() => {
    AsyncStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rewardCurrency,
        spendCurrency,
        resetCurrency,
        setRewardMultiplier,
        multiplier,
        saveCurrencyAsBaseline,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
