import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const TabNav = createBottomTabNavigator();

const BottomBarNavigator = () => (
  <TabNav.Navigator>
    <TabNav.Screen name="Home" component={HomeScreen} />
    <TabNav.Screen name="Profile" component={ProfileScreen} />
  </TabNav.Navigator>
);

export default BottomBarNavigator;
