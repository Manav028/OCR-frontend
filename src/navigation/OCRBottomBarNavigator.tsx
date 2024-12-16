import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import OcrTranslationScreen from '../screens/OcrTranslationScreen';

import { Keyboard } from 'react-native';
import OCRMainScreen from '../screens/OcrMainScreen';
import OcrSummaryScreen from '../screens/OcrSummaryScreen';

export type OCRStackParamList = {
  OCRMain: { photos: string[] };
  Translation: undefined;
  Summary : undefined;
};

const Tab = createBottomTabNavigator<OCRStackParamList>();

const OCRBottomBarNavigator: React.FC = () => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
      <Tab.Navigator
        screenOptions={({ route }: BottomTabScreenProps<OCRStackParamList>) => ({
          headerShown: false,
          tabBarStyle: {
            display: isKeyboardVisible ? 'none' : 'flex', 
            position: 'absolute',
            backgroundColor: '#fff',
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === 'OCRMain') {
              iconName = 'document-text-outline';
            } else if (route.name === 'Translation') {
              iconName = 'language-outline';
            } else if (route.name ===  'Summary'){
              iconName = 'reader-outline'
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="OCRMain"
          component={OCRMainScreen}
          options={{
            title: 'OCR',
          }}
        />
        <Tab.Screen
          name="Translation"
          component={OcrTranslationScreen}
          options={{
            title: 'Translate',
          }}
        />
        <Tab.Screen
          name="Summary"
          component={OcrSummaryScreen}
          options={{
            title: 'Summary',
          }}
        />
      </Tab.Navigator>
  );
};

export default OCRBottomBarNavigator;
