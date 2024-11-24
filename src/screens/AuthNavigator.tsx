import { StyleSheet, Text, View , ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type AuthNavigation = NativeStackScreenProps<AuthStackParamList,'AuthNavigation'>

const AuthNavigator = ({navigation}:AuthNavigation) => {

    useEffect(() => {
        const checkLoginStatus = async () => {
          const token = await AsyncStorage.getItem("token");
          
          if (token) {
            navigation.replace('Home'); 
          } else {
            navigation.replace('Login'); 
          }
        };
    
        checkLoginStatus();
      }, []);

  return (
    <View>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

export default AuthNavigator

const styles = StyleSheet.create({})