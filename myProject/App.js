import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import TabNavigator from './navigation/TabNavigator';

const fetchFonts = () => {
  return Font.loadAsync({
    // Map a font name to a font file in your assets folder
    'DynaPuff-Bold': require('./assets/fonts/DynaPuff,Montserrat/DynaPuff/static/DynaPuff-Bold.ttf'),
  });
};


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading 
        startAsync={fetchFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }
  
  return <TabNavigator />;
}
