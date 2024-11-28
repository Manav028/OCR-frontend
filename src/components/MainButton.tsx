import { StyleSheet, Text, View, TouchableOpacity, Dimensions , StyleProp , ViewStyle } from 'react-native'
import React from 'react'
import { Colors , fontfamily } from '../styles/Globalcss'

const {height} = Dimensions.get('window')

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    Style?: StyleProp<ViewStyle>; 
}

const MainButton: React.FC<CustomButtonProps> = ({ title, onPress, disabled = false ,Style}) => {
    return (
        <TouchableOpacity
            style={[styles.button, Style ,disabled && styles.disabledButton]} 
            onPress={onPress}
            disabled={disabled}>
            <Text style={[styles.buttonText, disabled && styles.disabledText]}>{title}</Text>
        </TouchableOpacity>
    );
};
export default MainButton

const styles = StyleSheet.create({
    button: {
        paddingVertical : 12,
        backgroundColor: Colors.thirdbackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: height > 600 ? 18 : 16,
        color: Colors.thirdtext,
        fontFamily : fontfamily.SpaceMonoBold
    },
    disabledButton: {
        backgroundColor: Colors.secondarytext, 
        opacity: 0.6,
    },
    disabledText: {
        color: Colors.secondarytext, 
    },
})