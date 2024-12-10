import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, FontSizes, fontfamily } from '../styles/Globalcss'; // Import global styles

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const scaleValue = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: string =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
            ? String(options.title)
            : route.name;

        const isFocused = state.index === index;

        const iconName: keyof typeof Ionicons.glyphMap =
          route.name === 'Home'
            ? (isFocused ? 'home' : 'home-outline')
            : route.name === 'Profile'
            ? (isFocused ? 'person' : 'person-outline')
            : route.name === 'Storage'
            ? (isFocused ? 'cloud' : 'cloud-outline')
            : 'help-circle-outline';

        const onPress = () => {
          animateButton();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}>
            <Animated.View style={{ transform: [{ scale: isFocused ? scaleValue : 1 }], alignItems : 'center' }}>
              <Ionicons
                name={iconName}
                size={28}
                color={isFocused ? Colors.secondarybackground : Colors.secondarytext} 
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? Colors.secondarybackground : Colors.secondarytext,
                    fontFamily: isFocused ? fontfamily.SpaceMonoBold : fontfamily.SpaceMonoRegular, 
                  },
                ]}>
                {label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    backgroundColor: Colors.primarybackground,
    borderRadius: 30,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: Colors.primaryshadowcolor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSizes.small,
    marginTop: 4,
  },
});