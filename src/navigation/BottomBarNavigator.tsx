import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import TabBar from '../components/TabBar'
import StorageScreen from '../screens/StorageScreen';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  Storage: undefined;
};


const TabNav = createBottomTabNavigator();

export const BottomBarNavigator = () => {
  return (
      <TabNav.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
        >
        <TabNav.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <TabNav.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <TabNav.Screen
          name='Storage'
          component={StorageScreen}
          options={{ title: 'Storage' }}
        />
      </TabNav.Navigator>
  );
};
