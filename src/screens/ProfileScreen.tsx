import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomStatusBar from '../components/CustomStatusBar'
import { Colors } from '../styles/Globalcss'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingBottom: 60 }}>
      <CustomStatusBar
        backgroundColor={Colors.primarybackground}
        translucent={false}
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View>
          <Text>ProfileScreen</Text>
          <TouchableOpacity>
            
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})