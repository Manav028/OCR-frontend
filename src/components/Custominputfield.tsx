import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

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
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, error ? styles.errorBorder : null]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#a9a9a9"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
        width: '100%'
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0', // Light gray border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Slight elevation for shadow on Android
    },
    errorBorder: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default CustomInput;
