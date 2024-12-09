import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStatusBar from '../components/CustomStatusBar'
import { Colors } from '../styles/Globalcss'

const StorageScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingBottom: 60 }}>
            <CustomStatusBar
                backgroundColor={Colors.primarybackground}
                translucent={false}
            />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{}}>
                    <Text style={{ fontSize: 200 }}>StorageScreen</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StorageScreen

const styles = StyleSheet.create({})