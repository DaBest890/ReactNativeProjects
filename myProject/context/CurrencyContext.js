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

  // DAILY RESET CHECK using server time (World Time API)
  useEffect(() => {
    const checkDailyReset = async () => {
      try {
        // Fetch the current UTC time from a public API
        const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
        const data = await response.json();
        const serverTime = new Date(data.datetime);
        const today = serverTime.toDateString();

        // Get the last reset date from AsyncStorage
        const lastResetDate = await AsyncStorage.getItem('lastResetDate');
        if (lastResetDate !== today) {
          // It's a new day – reset currency to the baseline value.
          const savedCurrency = await AsyncStorage.getItem('savedCurrency');
          const baseline = savedCurrency !== null ? JSON.parse(savedCurrency) : 0;
          setCurrency(baseline);
          // Also update the current currency storage key.
          await AsyncStorage.setItem('currency', JSON.stringify(baseline));
          // Update the stored reset date to today
          await AsyncStorage.setItem('lastResetDate', today);
        }
      } catch (error) {
        console.error('Error during daily reset check:', error);
      }
    };

    checkDailyReset();
  }, []);

  // This function rewards currency and updates the current value only.
  // It does NOT update the baseline ("savedCurrency").
  const rewardCurrency = () => {
    setCurrency(prevCurrency => {
      const newCurrency = prevCurrency + (10 * multiplier);
      // Update only the current currency value
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
      return newCurrency;
    });
  };

  // This function spends currency and updates the current value only.
  const spendCurrency = (amount) => {
    setCurrency(prevCurrency => {
      const newCurrency = Math.max(0, prevCurrency - amount);
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
      return newCurrency;
    });
  };

  // resetCurrency: reverts to the baseline value stored under "savedCurrency".
  const resetCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem('savedCurrency');
      const baselineCurrency = savedCurrency !== null ? JSON.parse(savedCurrency) : 0;
      setCurrency(baselineCurrency);
      AsyncStorage.setItem('currency', JSON.stringify(baselineCurrency));
    } catch (error) {
      console.error('Error resetting currency:', error);
    }
  };

  // Allows updating the reward multiplier
  const setRewardMultiplier = (value) => {
    setMultiplier(value);
  };

  // Helper function to update the baseline value manually.
  // Call this when you want to "lock in" a new baseline.
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
