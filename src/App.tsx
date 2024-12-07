import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import AppNavigator from './navigation/AppNavigator';


function App(): React.JSX.Element {
  const Tab = createBottomTabNavigator();
  
  return (
    <AppNavigator/>
  );
}

export default App;
