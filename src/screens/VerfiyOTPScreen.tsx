import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import MainButton from '../components/MainButton';
import { API_URL } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import CustomInput from '../components/Custominputfield';
import { Colors, fontfamily } from '../styles/Globalcss';

type OTPVerificationScreenPorps = NativeStackScreenProps<AuthStackParamList,'VerifyOTPScreen'>

const OTPVerificationScreen: React.FC<OTPVerificationScreenPorps> = ({ route, navigation }) => {

    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [OTPError, setOTPError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = async () => {
        setOTPError(null);

        if (otp.trim().length === 0) {
            setOTPError('OTP is required');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/api/auth/verifyOTP`, { email, otp });

            if (response.data.message) {
                Alert.alert('Success', 'Email verified successfully!');
                navigation.replace('Login');
            }
        } catch (err:any) {
            if (err.response && err.response.data) {
                setOTPError(err.response.data.error);
            } else {
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/resendOTP`, { email });
            Alert.alert('Success', 'A new OTP has been sent to your email.');
        } catch (err) {
            Alert.alert('Error', 'Unable to resend OTP. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Verify Your Email</Text>
            <Text style={styles.Subheading}> {email} </Text>
            <CustomInput placeholder='Verify OTP' value={otp} error={OTPError} onChangeText={(value)=> {setOtp(value); setOTPError(null);}} keyboardType='numeric' />
            <MainButton title="Verify" onPress={handleVerifyOTP} loading={loading} />
            <Text style={styles.resendLink} onPress={handleResendOTP}>
                Resend OTP
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 24,
        textAlign: 'center',
        
        fontFamily : fontfamily.SpaceMonoBold
    },
    Subheading:{
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily : fontfamily.SpaceMonoRegular
    },
    resendLink: {
        color : Colors.primartext,
        textAlign: 'center',
        marginTop: 10,
        fontFamily : fontfamily.SpaceMonoBold
    },
});

export default OTPVerificationScreen;
