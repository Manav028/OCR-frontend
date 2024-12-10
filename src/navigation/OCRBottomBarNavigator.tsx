import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OcrMainScreen from '../screens/OcrMainScreen';

  const Tab = createBottomTabNavigator();

export type OCRStackParamList = {
  OCRMain: { photos: string[] };
};

const OCRBottomBarNavigator = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name='OCRMain' component={OcrMainScreen}/>
    </Tab.Navigator>
  )
}

export default OCRBottomBarNavigator

const styles = StyleSheet.create({})