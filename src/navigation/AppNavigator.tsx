import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import { BottomBarNavigator } from './BottomBarNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OCRBottomBarNavigator from './OCRBottomBarNavigator';
import Video from 'react-native-video';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token)
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsAuthenticated(false);
      }
    };

    const splashTimer = setTimeout(() => {
      setIsSplashComplete(true);
    }, 3000);

    checkLoginStatus();

    return () => clearTimeout(splashTimer);
  }, []);

  if (!isSplashComplete) {
    return (
      <View style={styles.container}>
        <Video
          source={require('../../assets/video/OCR1.mp4')}
          style={styles.video}
          resizeMode="contain" 
          onEnd={() => setIsSplashComplete(true)} 
          repeat={false} 
          muted={false} 
        />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Main" component={BottomBarNavigator} />
              <Stack.Screen name="OCR" component={OCRBottomBarNavigator} />
              <Stack.Screen name="Auth" component={AuthNavigator} />
            </>
          ) : (
            <>
              <Stack.Screen name="Auth" component={AuthNavigator} />
              <Stack.Screen name="OCR" component={OCRBottomBarNavigator} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};


export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  video: {
    width: '90%',
    height: '100%',
  },
});
