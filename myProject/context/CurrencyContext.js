import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(0);
  const [multiplier, setMultiplier] = useState(1); // Multiplier for rewards

  useEffect(() => {
    const loadBaselineCurrency = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem('savedCurrency');
        if (savedCurrency !== null) {
          const parsedCurrency = JSON.parse(savedCurrency);
          setCurrency(parsedCurrency);
        } else {
          await AsyncStorage.setItem('savedCurrency', JSON.stringify(0));
        }
      } catch (error) {
        console.error('Error loading saved baseline currency:', error);
      }
    };
    loadBaselineCurrency();
  }, []);

  useEffect(() => {
    const checkDailyReset = async () => {
      try {
        const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
        const data = await response.json();
        const serverTime = new Date(data.datetime);
        const today = serverTime.toDateString();

        const lastResetDate = await AsyncStorage.getItem('lastResetDate');
        if (lastResetDate !== today) {
          const savedCurrency = await AsyncStorage.getItem('savedCurrency');
          const baseline = savedCurrency !== null ? JSON.parse(savedCurrency) : 0;
          setCurrency(baseline);
          await AsyncStorage.setItem('currency', JSON.stringify(baseline));
          await AsyncStorage.setItem('lastResetDate', today);
        }
      } catch (error) {
        console.error('Error during daily reset check:', error);
      }
    };

    checkDailyReset();
  }, []);

  const rewardCurrency = () => {
    setCurrency(prevCurrency => {
      const newCurrency = prevCurrency + (10 * multiplier);
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
      return newCurrency;
    });
  };

  const spendCurrency = (amount) => {
    setCurrency(prevCurrency => {
      if (prevCurrency < amount) {
        console.warn(`Transaction denied: Not enough Dad Dollars. Current balance: ${prevCurrency}, Attempted spend: ${amount}`);
        return prevCurrency; // Do nothing if insufficient funds
      }
      const newCurrency = prevCurrency - amount;
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
      return newCurrency;
    });
  };

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

  const setRewardMultiplier = (value) => {
    setMultiplier(value);
  };

  const saveCurrencyAsBaseline = async () => {
    try {
      await AsyncStorage.setItem('savedCurrency', JSON.stringify(currency));
    } catch (error) {
      console.error('Error saving baseline currency:', error);
    }
  };

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
