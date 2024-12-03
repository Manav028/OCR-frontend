import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { Colors, fontfamily } from '../styles/Globalcss';

const { height } = Dimensions.get('window');

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean; 
  Style?: StyleProp<ViewStyle>;
}

const MainButton: React.FC<CustomButtonProps> = ({ title, onPress, disabled = false, loading = false, Style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, Style, (disabled || loading) && styles.disabledButton]} 
      onPress={onPress}
      disabled={disabled || loading} 
    >
      {loading ? ( 
        <ActivityIndicator size="small" color={Colors.thirdtext} />
      ) : (
        <Text style={[styles.buttonText, (disabled || loading) && styles.disabledText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    backgroundColor: Colors.thirdbackground,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: height > 600 ? 18 : 16,
    color: Colors.thirdtext,
    fontFamily: fontfamily.SpaceMonoBold,
  },
  disabledButton: {
    backgroundColor: Colors.secondarytext,
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.secondarytext,
  },
});
