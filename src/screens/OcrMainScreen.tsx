import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { OCRStackParamList } from '../navigation/OCRBottomBarNavigator';

type OcrMainScreenProps = NativeStackScreenProps<OCRStackParamList,'OCRMain'>

const OCRMainScreen: React.FC<OcrMainScreenProps> = ({ route }) => {
  const { photos } = route.params || {}; // Safely access params
  console.log('Photos received:', photos);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>OCR Main Screen</Text>
      {photos && photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
        />
      ) : (
        <Text style={styles.noPhotosText}>No photos to display</Text>
      )}
    </View>
  );
};


export default OCRMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  noPhotosText: {
    fontSize: 16,
    color: 'gray',
  },
});
