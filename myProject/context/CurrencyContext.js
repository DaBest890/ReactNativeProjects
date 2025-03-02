import React, { createContext, useState } from 'react';

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(0);
  const rewardCurrency = () => {
    setCurrency(prevCurrency => prevCurrency + 10); // Reward user with currency for completing tasks
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rewardCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
