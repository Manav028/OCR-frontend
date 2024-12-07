import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import CustomInput from '../components/Custominputfield';
import { Globalcss, Colors, FontSizes, fontfamily } from '../styles/Globalcss'
import { ScrollView } from 'react-native-gesture-handler';
import Screenheading from '../components/Screenheading'
import MainButton from '../components/MainButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';

const { height } = Dimensions.get('window');

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEmpty = () => {
        let isValid = true;
        if (email.length === 0) {
            setEmailError('Email is required');
            isValid = false;
        }
        if (password.length === 0) {
            setPasswordError('Password is required');
            isValid = false;
        }
        return isValid;
    };

    const handleLogin = async () => {

        setEmailError(null)
        setPasswordError(null)
        setLoginError(null)

        if (!handleEmpty()) {
            return;
        }

        try {
            console.log("manac")
            setLoading(true)
            const response = await axios.post(`${API_URL}/api/auth/signin`, { email, password });
            if (response.data && response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                  });
            }
        } catch (error: any) {
            console.log(error);

            if (error.response && error.response.data) {
                const errorData = error.response.data.error;
                console.log('Error Data:', errorData);
                if (
                    errorData.email === 'Invalid email or password' &&
                    errorData.password === 'Invalid email or password'
                ) {
                    setEmailError(null)
                    setPasswordError(null)
                    setLoginError('Invalid email or password');
                    return;
                }
                else if (errorData.email === 'User not found') {
                    setEmailError(null)
                    setPasswordError(null)
                    setLoginError('User not found, please register');
                    return
                }
                else if (errorData.email === "Email is not verified") {
                    setEmailError(null)
                    setPasswordError(null)
                    const response = await axios.post(`${API_URL}/api/auth/resendOTP`, { email });
                    if(response.data && response.data.message){
                        navigation.navigate('VerifyOTPScreen',{email})
                        return
                    }
                }
                setEmailError(errorData.email || null);
                setPasswordError(errorData.password || null);
            } else {
                Alert.alert('Login Error', 'An error occurred during login. Please try again.');
            }
        }
        finally {
            setLoading(false)
        }

    };

    return (
        <SafeAreaView style={styles.safeArea}>

            <CustomStatusBar
                backgroundColor={Colors.primarybackground}
                translucent={false}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={Globalcss.ScroolViewContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>

                        <View style={styles.textcontainer}>
                            <Screenheading title={'Login in to get started'} subtitle={"Sign In"} />
                        </View>

                        <CustomInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setEmailError(null);
                            }}
                            error={emailError}
                            keyboardType="email-address"
                        />

                        <CustomInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setPasswordError(null);
                            }}
                            error={passwordError}
                            keyboardType="default"
                            secureTextEntry
                        />

                        <MainButton title={"Sign In"} onPress={handleLogin} loading={loading} />

                        {loginError && <Text style={styles.loginErrorText}>{loginError}</Text>}

                        <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                            <View style={styles.lineContainer}>
                                <Text style={styles.registerText}>
                                    Don't have an account?{' '}
                                    <Text style={styles.registerLink}>
                                        Register
                                    </Text>
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.primarybackground,
        minHeight: height,
    },
    textcontainer: {
        marginBottom: 25,
    },
    loginErrorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
    },
    lineContainer: {
        alignSelf: 'center',
        marginTop: 16,
        borderBottomWidth: 1,

    },
    registerText: {
        color: Colors.primartext,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: fontfamily.SpaceMonoRegular,
    },
    registerLink: {
        color: Colors.primartext,
        fontFamily: fontfamily.SpaceMonoBold,
    },
});

export default LoginScreen;