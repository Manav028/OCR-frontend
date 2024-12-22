import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, fontfamily } from '../styles/Globalcss';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install and link react-native-vector-icons

type CustomInputProps = {
    value: string;
    placeholder: string;
    error: string | null;
    onChangeText: (value: string) => void;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
};

const CustomInput: React.FC<CustomInputProps> = ({
    value,
    placeholder,
    error,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.inputContainer}>
            <View style={styles.textInputWrapper}>
                <TextInput
                    style={[styles.input, error ? styles.errorBorder : null]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    placeholderTextColor="#a9a9a9"
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                    >
                        <Icon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={24}
                            color="#a9a9a9"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
        width: '100%',
    },
    textInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: Colors.secondaryborder,
        borderRadius: 8,
        shadowColor: Colors.primaryshadowcolor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: Colors.primaryborder,
        fontFamily: fontfamily.SpaceMonoRegular,
    },
    eyeIcon: {
        padding: 10,
    },
    errorBorder: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        fontFamily: fontfamily.SpaceMonoBold,
    },
});

export default CustomInput;
