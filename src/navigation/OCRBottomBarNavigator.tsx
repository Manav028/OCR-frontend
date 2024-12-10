import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OCRMainScreen from '../screens/OcrMainScreen';
import Clipboard from '@react-native-clipboard/clipboard';

export type OCRStackParamList = {
  OCRMain: { photos: string[] };
};

const Tab = createBottomTabNavigator<OCRStackParamList>();

const OCRBottomBarNavigator = () => {
  const copyText = (text: string) => {
    Clipboard.setString(text);

  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="OCRMain"
        component={OCRMainScreen}

        options={{
          title: 'OCR',
        }}
      />
    </Tab.Navigator>
  );
};

export default OCRBottomBarNavigator;

const styles = StyleSheet.create({

});
