import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TokenAuth  from '../screens/TokenAuth';
import TutorialScreen from '../screens/TutorialScreen';
import VerifyOTPScreen from '../screens/VerfiyOTPScreen'


export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    Home : undefined;
    TokenAuth : undefined;
    TutorialScreen : undefined
    VerifyOTPScreen : {"email" : String}
};

const Stack = createStackNavigator<AuthStackParamList>();



const AuthNavigator: React.FC = () => (
    <Stack.Navigator
        initialRouteName="TokenAuth"
        screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS,
        }}
    >
        <Stack.Screen name='VerifyOTPScreen' component={VerifyOTPScreen}/>
        <Stack.Screen name='TokenAuth' component={TokenAuth}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TutorialScreen" component={TutorialScreen}/>
    </Stack.Navigator>
);

export default AuthNavigator;
