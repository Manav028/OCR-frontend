import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { Colors , fontfamily } from '../styles/Globalcss'

const {height} = Dimensions.get('window')

interface CustomButtonProps {
    title : String,
    onPress : ()=>void,
}

const MainButton : React.FC<CustomButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

export default MainButton

const styles = StyleSheet.create({
    button: {
        paddingVertical : 12,
        backgroundColor: Colors.thirdbackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
    },
    buttonText: {
        fontSize: height > 600 ? 18 : 16,
        color: Colors.thirdtext,
        fontFamily : fontfamily.SpaceMonoBold
    },
})