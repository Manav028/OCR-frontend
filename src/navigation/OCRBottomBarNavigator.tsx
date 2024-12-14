import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import OcrTranslationScreen from '../screens/OcrTranslationScreen';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Keyboard } from 'react-native';
import OCRMainScreen from '../screens/OcrMainScreen';

export type OCRStackParamList = {
  OCRMain: { photos: string[] };
  Translation: undefined;
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
    <Provider store={store}>
      <Tab.Navigator
        screenOptions={({ route }: BottomTabScreenProps<OCRStackParamList>) => ({
          headerShown: false,
          tabBarStyle: {
            display: isKeyboardVisible ? 'none' : 'flex', // Hide the tab bar when the keyboard is visible
            position: 'absolute',
            backgroundColor: '#fff',
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === 'OCRMain') {
              iconName = 'document-text-outline';
            } else if (route.name === 'Translation') {
              iconName = 'language-outline';
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
      </Tab.Navigator>
    </Provider>
  );
};

export default OCRBottomBarNavigator;
