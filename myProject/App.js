import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import TabNavigator from './navigation/TabNavigator';

SplashScreen.preventAutoHideAsync(); // Prevents splash screen from hiding until fonts are loaded

const fetchFonts = async () => {
  await Font.loadAsync({
    'DynaPuff-Bold': require('./assets/fonts/DynaPuff,Montserrat/DynaPuff/static/DynaPuff-Bold.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await fetchFonts();
      setFontsLoaded(true);
      await SplashScreen.hideAsync(); // Hides splash screen when fonts are loaded
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Prevents rendering until fonts are loaded
  }

  return <TabNavigator />;
}
