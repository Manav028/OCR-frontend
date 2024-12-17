import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App(): React.JSX.Element {
  const Tab = createBottomTabNavigator();

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;
