import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { OCRStackParamList } from '../navigation/OCRBottomBarNavigator';
import { extractTextFromImage } from '../services/ocrService';
import Clipboard from '@react-native-clipboard/clipboard';
import { Colors } from '../styles/Globalcss';
import CustomStatusBar from '../components/CustomStatusBar';
import Icon from 'react-native-vector-icons/Ionicons'; // Add Ionicons for icons

type OcrMainScreenProps = BottomTabScreenProps<OCRStackParamList, 'OCRMain'>;

const OCRMainScreen: React.FC<OcrMainScreenProps> = ({ route }) => {
  const { photos } = route.params || {};
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExtractedText = async () => {
      if (!photos || photos.length === 0) {
        setExtractedText('No images provided for text extraction.');
        return;
      }

      try {
        setLoading(true);
        let combinedText = '';
        for (const photo of photos) {
          const text = await extractTextFromImage(photo);
          if (text) {
            combinedText += text + '\n\n';
          }
        }
        setExtractedText(combinedText || 'No text could be extracted from the images.');
      } catch (error) {
        console.error('Error during text extraction:', error);
        Alert.alert('Error', 'An error occurred while extracting text.');
      } finally {
        setLoading(false);
      }
    };

    fetchExtractedText();
  }, [photos]);

  const copyToClipboard = () => {
    if (extractedText) {
      Clipboard.setString(extractedText);
      Alert.alert('Copied', 'Extracted text has been copied to clipboard.');
    }
  };

  const shareText = () => {
    if (extractedText) {
      Alert.alert('Share', 'This is where you can integrate a sharing feature!');
    }
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar backgroundColor={Colors.fourthbackgroound} />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <ScrollView style={styles.textContainer}>
            <View style={styles.textContainerinner}>
              <Text style={styles.heading}>Extracted Text</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Icon name="copy-outline" size={24} color={Colors.primaryborder} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={shareText}>
                  <Icon name="share-social-outline" size={24} color={Colors.primaryborder} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.extractedTextInput}
              value={extractedText || ''}
              onChangeText={(text) => setExtractedText(text)}
              multiline={true}
              textAlignVertical="top"
            />
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default OCRMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlignVertical: 'center', 
    flex: 1, 
  },
  textContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.fourthbackgroound,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    display: 'flex',
  },
  extractedTextInput: {
    fontSize: 16,
    color: '#333',
    backgroundColor: Colors.fourthbackgroound,
    padding: 10,
    borderColor: Colors.primaryborder,
    borderWidth: 2,
    minHeight: 200,
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    textAlignVertical: 'top',
  },
  textContainerinner: {
    borderWidth: 2,
    borderColor: Colors.primaryborder,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    height: 50,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
});
