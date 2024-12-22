import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors, fontfamily } from '../styles/Globalcss';

const {height} = Dimensions.get('window')

interface Screenheadingprops {
  title : String,
  subtitle : String
}

const Screenheading : React.FC<Screenheadingprops> = ({title,subtitle}) => {
  return (
    <View style={styles.container}>
    
      <Text style={styles.title}>{title}</Text>
    
    <View style={styles.textcontainer}>
      <Text style={styles.subtitle}>{subtitle}</Text>
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
    gap : 5
  },
  textcontainer: {
    width : '100%',
    borderColor: Colors.primaryborder,
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative'
},
  title: {
    fontSize: height > 600 ? 32 : 28,
    color: Colors.primartext,
    fontFamily : fontfamily.SpaceMonoBold,
    textAlign : 'center',
},
subtitle: {
    fontSize: height > 600 ? 16 : 14,
    textAlign: 'center',
    width : '100%',
    fontFamily: fontfamily.SpaceMonoRegular,
  },
});
