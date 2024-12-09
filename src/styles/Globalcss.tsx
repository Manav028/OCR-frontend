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
    primarybackground: 'white',
    secondarybackground : '#4c669f',
    thirdbackground : 'black',
    fourthbackgroound : '#fef9c3',
    fifthbackground : '#EDEEF0',
    primartext : '#333',
    secondarytext : '#666',
    thirdtext : 'white',
    primaryshadowcolor : '#000',
    primaryborder : '#333', 
    secondaryborder: 'black'
};

const FontSizes = {
    small: 12,
    medium: 16,
    large: 20,
};

const fontfamily = {
    SpaceMonoBold : 'SpaceMono-Bold',
    SpaceMonoBoldItalic : 'SpaceMono-BoldItalic',
    SpaceMonoItalic : 'SpaceMono-Italic',
    SpaceMonoRegular : 'SpaceMono-Regular',
};
  
export { Globalcss, Colors, FontSizes , fontfamily};