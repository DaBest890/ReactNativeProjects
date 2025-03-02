import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(0);
  const [multiplier, setMultiplier] = useState(1); // Multiplier for rewards
  const rewardCurrency = () => {
    setCurrency(prevCurrency => {
      const newCurrency = prevCurrency + (10 * multiplier);
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency)); // Save updated currency
      return newCurrency;
    });
  };

  const spendCurrency = (amount) => {
    setCurrency(prevCurrency => {
      const newCurrency = Math.max(0, prevCurrency - amount);
      AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
      return newCurrency;
    });
  };

  const resetCurrency = () => {
    setCurrency(0);
    AsyncStorage.setItem('currency', JSON.stringify(0));
  };

  const setRewardMultiplier = (value) => {
    setMultiplier(value);
  };

  useEffect(() => {
    const loadCurrency = async () => {
      const storedCurrency = await AsyncStorage.getItem('currency');
      if (storedCurrency !== null) {
        setCurrency(JSON.parse(storedCurrency));
      }
    };
    loadCurrency();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rewardCurrency, spendCurrency, resetCurrency, setRewardMultiplier, multiplier }}>
      {children}
    </CurrencyContext.Provider>
  );
}
