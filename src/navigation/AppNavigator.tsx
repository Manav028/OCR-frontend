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
import CustomStatusBar from '../components/CustomStatusBar';

const Stack = createNativeStackNavigator();

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVideoReady, setIsVideoReady] = useState(false);

  return (
    <View style={styles.splashContainer}>
      {!isVideoReady && (
        <ActivityIndicator size="large" color="black" style={styles.loader} />
      )}
      <CustomStatusBar barStyle="light-content" backgroundColor="white" />
      <Video
        source={require('../../assets/video/OCR1.mp4')} // Ensure this path is correct
        style={styles.video}
        resizeMode="contain"
        onLoad={() => setIsVideoReady(true)}
        onEnd={onComplete}
        repeat={false}
        muted={false}
        paused={false} // Ensures the video plays immediately
        controls={false} // Hides video controls
        onError={(e) => console.error('Video Error:', e)} // Logs video errors
      />
      <Text style={styles.welcomeText}>Welcome To OCR</Text>
    </View>
  );
};

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
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

    checkLoginStatus();
  }, []);

  if (!isSplashComplete) {
    return <SplashScreen onComplete={() => setIsSplashComplete(true)} />;
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
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  video: {
    width: '100%',
    height: '80%',
    backgroundColor: '#fff',
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});
