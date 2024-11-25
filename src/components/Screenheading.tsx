import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors, fontfamily } from '../styles/Globalcss';

const {height} = Dimensions.get('window')

const Screenheading = () => {
  return (
    <View style={styles.container}>
    
      <Text style={styles.title}>Login in to get Started</Text>
    
    <View style={styles.textcontainer}>
      <Text style={styles.subtitle}>Sign In</Text>
    </View>
    </View>
  );
};

export default Screenheading;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
    gap : 10
  },
  textcontainer: {
    width : '100%',
    borderColor: Colors.primaryborder,
    borderWidth: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical : 15,
    paddingHorizontal : 8,
    position: 'relative'
},
  title: {
    fontSize: height > 600 ? 28 : 24,
    color: Colors.primartext,
    fontFamily : fontfamily.SpaceMonoBold,
    textAlign : 'center',
    marginBottom : 20
},
subtitle: {
    fontSize: height > 600 ? 16 : 14,
    color: Colors.thirdtext,
    textAlign: 'center',
    width : '100%',
    fontFamily: fontfamily.SpaceMonoRegular,
    paddingHorizontal : 16,
    paddingVertical : 8,
    position: 'absolute',
    backgroundColor : Colors.thirdbackground,
    bottom : -15
  },
});
