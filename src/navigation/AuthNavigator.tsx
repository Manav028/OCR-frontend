import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import TutorialScreen from '../screens/TutorialScreen';
import VerifyOTPScreen from '../screens/VerfiyOTPScreen'
import LoginScreen from '../screens/LoginScreen';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    TutorialScreen: undefined
    VerifyOTPScreen: { "email": String }
    Main: undefined
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => (
    <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='VerifyOTPScreen' component={VerifyOTPScreen} />        
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="TutorialScreen" component={TutorialScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
	