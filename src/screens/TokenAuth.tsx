import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type TokenAuthProps = NativeStackScreenProps<AuthStackParamList, 'TokenAuth'>;

const TokenAuth: React.FC<TokenAuthProps> = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      AsyncStorage.clear()
      try {
        const token = await AsyncStorage.getItem('token');
        setTimeout(() => {
          if (token) {
            navigation.replace('Home'); 
          } else {
            navigation.replace('Login');
          }
        }, 3000);
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('Login'); 
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Checking authentication status...</Text>
    </View>
  );
};

export default TokenAuth;

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
});
