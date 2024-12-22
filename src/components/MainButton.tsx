import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { Colors, fontfamily } from '../styles/Globalcss';

const { height } = Dimensions.get('window');

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean; 
  Style?: StyleProp<ViewStyle>;
  textColor?: string;
  touchable?: boolean;
}

const MainButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false, 
  Style, 
  textColor = Colors.thirdtext, 
  touchable = true 
}) => {
  const ButtonContent = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }, (disabled || loading) && styles.disabledText]}>
          {title}
        </Text>
      )}
    </>
  );

  if (touchable) {
    return (
      <TouchableOpacity
        style={[styles.button, Style, (disabled || loading) && styles.disabledButton]} 
        onPress={onPress}
        disabled={disabled || loading} 
      >
        {ButtonContent}
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={[styles.button, Style, (disabled || loading) && styles.disabledButton]}>
        {ButtonContent}
      </View>
    );
  }
};

export default MainButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    backgroundColor: Colors.thirdbackground,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius : 20,
  },
  buttonText: {
    fontSize: height > 600 ? 18 : 16,
    fontFamily: fontfamily.SpaceMonoBold,
  },
  disabledButton: {
    backgroundColor: Colors.secondarytext,
    opacity: 0.6,
    borderRadius : 6
  },
  disabledText: {
    color: Colors.secondarytext,
  },
});
