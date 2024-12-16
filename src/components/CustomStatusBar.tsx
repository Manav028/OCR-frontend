import { StatusBar, StatusBarStyle, StyleSheet, Text, View } from 'react-native'
import React from 'react'


interface CustomStatusBar {
    backgroundColor: string;
    barStyle?: StatusBarStyle;
    translucent?: boolean;
}

const CustomStatusBar: React.FC<CustomStatusBar> = ({backgroundColor, barStyle = 'default', translucent = false}) => {
    return (
        <StatusBar
            backgroundColor={backgroundColor}
            barStyle={"dark-content"}
            translucent={translucent}
        
        />
    )
}

export default CustomStatusBar
