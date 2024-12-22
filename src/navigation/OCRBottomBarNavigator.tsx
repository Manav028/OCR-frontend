import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import OcrTranslationScreen from '../screens/OcrTranslationScreen';
import { Keyboard, TouchableOpacity } from 'react-native';
import OCRMainScreen from '../screens/OcrMainScreen';
import OcrSummaryScreen from '../screens/OcrSummaryScreen';
import { useNavigation } from '@react-navigation/native';


export type OCRStackParamList = {
  OCRMain: undefined;
  Translation: undefined;
  Summary: undefined;
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
        headerStyle: { backgroundColor: 'black', },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft : () => {
          const navigation = useNavigation();
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 15 }}
            >
              <Icon name="arrow-back-outline" size={25} color="white" />
            </TouchableOpacity>
          );
        },
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
          } else if (route.name === 'Summary') {
            iconName = 'reader-outline'
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="OCRMain"
        component={OCRMainScreen}
        options={{
          title: 'Extracted Text',
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
