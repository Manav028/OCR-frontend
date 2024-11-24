import { StyleSheet } from "react-native";

const Globalcss = StyleSheet.create({
    ScroolViewContainer : {
        flex : 1,
        flexGrow: 1
    },

    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
      },
      textPrimary: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
})

const Colors = {
    primarybackground: '#f7f7f7',
    secondarybackground : '#4c669f',
    primartext : '#333',
    secondarytext : '#666',
    thirdtext : 'white',
    primaryshadowcolor : '#000'
};

const FontSizes = {
    small: 12,
    medium: 16,
    large: 20,
};
  
export { Globalcss, Colors, FontSizes };