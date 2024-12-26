import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, TextInput, Dimensions, KeyboardAvoidingView, Platform, StatusBar, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import CustomInput from '../components/Custominputfield'
import axios from 'axios';
import { API_URL } from '@env';
import { Globalcss, Colors, FontSizes, fontfamily } from '../styles/Globalcss'
import { ScrollView } from 'react-native-gesture-handler';
import Screenheading from '../components/Screenheading'
import MainButton from '../components/MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatusBar from '../components/CustomStatusBar';


const { height } = Dimensions.get('window')

type RegisterScreenProp = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProp> = ({ navigation }: RegisterScreenProp) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [usernameError, setusernameError] = useState<string | null>(null);
    const [confirmPassworderror, setconfirmPassworderror] = useState<string | null>(null);
    const [registererror, setregistererror] = useState<String | null>()
    const [loading, setLoading] = useState(false);

    const handleempty = () => {
        let isValid = true;
        if (username.length === 0) {
            setusernameError("Username is required");
            isValid = false;
        }
        if (email.length === 0) {
            setEmailError("Email is required");
            isValid = false;
        }
        if (password.length === 0) {
            setPasswordError("Password is required");
            isValid = false;
        }
        if (password !== confirmPassword) {
            setconfirmPassworderror("Password Doesn't match");
            isValid = false;
        }
        return isValid;
    };

    const handleRegister = async () => {

        setEmailError(null)
        setPasswordError(null)
        setregistererror(null)
        setusernameError(null)

        if (!handleempty()) {
            return
        }

        try {
            setLoading(true)

            const response = await axios.post(`${API_URL}/api/auth/signup`, { username, email, password })
            if (response.data && response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                navigation.navigate('VerifyOTPScreen',{email})
            }
        } catch (error: any) {
            console.log(error)
            if (error.response && error.response.data) {
                const errorData = error.response.data.error;
                console.log(errorData)
                if (errorData.email === 'Email is already registered') {
                    setEmailError("Email is already registered")
                    setPasswordError(null)
                    setconfirmPassworderror(null)
                    setusernameError(null)
                    
                    return;
                } else if (errorData.username === 'Username is already exist'){
                    setEmailError(null)
                    setPasswordError(null)
                    setconfirmPassworderror(null)
                    setusernameError("Username is already exist")
                }
                setEmailError(errorData.email || null)
                setPasswordError(errorData.password || null)
                setusernameError(errorData.username || null)
            } else {
                Alert.alert('Register Error', 'An error occurred during login. Please try again.');
            }
        }
        finally{
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
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        
                        <View style={styles.textcontainer}>
                            <Screenheading title={'Sign Up'} subtitle={'Create your account'} />
                        </View>

                        <CustomInput
                            placeholder="Username"
                            value={username}
                            onChangeText={(value) => {
                                setUsername(value);
                                setusernameError(null);
                            }}
                            keyboardType="email-address"
                            error={usernameError}
                        />
                        <CustomInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setEmailError(null);
                            }}
                            keyboardType="email-address"
                            error={emailError}
                        />
                        <CustomInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setPasswordError(null);
                            }}
                            error={passwordError}
                            secureTextEntry
                        />
                        <CustomInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(value) => {
                                setConfirmPassword(value);
                                setconfirmPassworderror(null);
                            }}
                            error={confirmPassworderror}
                            secureTextEntry
                        />

                        <MainButton title={'Sign Up'} onPress={handleRegister} loading={loading} />

                        {registererror && <Text style={styles.registerErrorText}>{registererror}</Text>}

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <View style={styles.lineContainer}>
                                <Text style={styles.registerText}>
                                    Already have an account?{' '}
                                    <Text style={styles.registerLink}>Log In</Text>
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
    scrollView: {
        flex: 1,
    },
    registerErrorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
        fontFamily : fontfamily.SpaceMonoRegular
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

export default RegisterScreen;
