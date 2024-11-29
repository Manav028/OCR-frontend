import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AuthNavigator';
import { StatusBar } from 'react-native';
import {Colors} from './styles/Globalcss'

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AppNavigator />  
    </NavigationContainer>
  );
}

export default App;
