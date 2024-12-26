import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface OCRInnerHeaderProps {
    title : string
}

const OCRInnerHeader : React.FC<OCRInnerHeaderProps> = ({title}) => {
  return (
    <View style={{width : "100%", paddingVertical : 10, alignItems : 'center', justifyContent : 'center', backgroundColor : 'black'}}>
        <Text style={{color : 'white', fontSize : 30}}> {title} </Text>
    </View>
  )
}

export default OCRInnerHeader

const styles = StyleSheet.create({})