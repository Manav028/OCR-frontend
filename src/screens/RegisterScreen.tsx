import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import CustomInput from '../components/Custominputfield'
import { isValid } from 'zod';
import axios from 'axios';
import {API_URL} from '@env';

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

    const handleRegister = () => {

        if(!handleempty()){
            return
        }

        try{
            const response = axios(`${API_URL}`)
        }catch(error){

        }

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <CustomInput
                placeholder='Username'
                value={username}
                onChangeText={(value) => {
                    setUsername(value)
                    setusernameError(null)
                }}
                keyboardType='email-address'
                error={usernameError}
            />
            <CustomInput
                placeholder='Email'
                value={email}
                onChangeText={(value) => {
                    setEmail(value)
                    setEmailError(null)
                }}
                keyboardType='email-address'
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
            <Button title="Register" onPress={handleRegister} />
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Already have an account? Login
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 16, paddingHorizontal: 8 },
    link: { color: 'blue', marginTop: 16, textAlign: 'center' }
});

export default RegisterScreen;
