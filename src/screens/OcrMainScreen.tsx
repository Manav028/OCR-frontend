import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Share,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { OCRStackParamList } from '../navigation/OCRBottomBarNavigator';
import { extractTextFromImage } from '../services/ocrService';
import Clipboard from '@react-native-clipboard/clipboard';
import { Colors, fontfamily } from '../styles/Globalcss';
import CustomStatusBar from '../components/CustomStatusBar';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

type OcrMainScreenProps = BottomTabScreenProps<OCRStackParamList, 'OCRMain'>;

const OCRMainScreen: React.FC<OcrMainScreenProps> = ({ route }) => {
  const { photos } = route.params || {};
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const fetchExtractedText = async () => {
      if (!photos || photos.length === 0) {
        setExtractedText('No images provided for text extraction.');
        return;
      }

      try {
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
      }
    };

    fetchExtractedText();
  }, [photos]);

  const copyToClipboard = () => {
    if (extractedText) {
      Clipboard.setString(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } else {
      Alert.alert('Nothing to Copy', 'No text available to copy.');
    }
  };

  const shareText = async () => {
    if (extractedText) {
      try {
        await Share.share({
          message: extractedText,
          title: 'Extracted Text',
        });
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } catch (error) {
        console.error('Error during sharing:', error);
        Alert.alert('Error', 'Unable to share text at this moment.');
      }
    } else {
      Alert.alert('Nothing to Share', 'No text available to share.');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <CustomStatusBar backgroundColor={Colors.fourthbackgroound} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: keyboardVisible ? 0 : 70 }, // Ensure consistent gap when keyboard is hidden
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.heading}>Extracted Text</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Icon
                    name={copied ? 'checkmark-done-outline' : 'copy-outline'}
                    size={24}
                    color={Colors.primaryborder}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={shareText}>
                  <Icon
                    name={shared ? 'checkmark-done-outline' : 'share-social-outline'}
                    size={24}
                    color={Colors.primaryborder}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={[
                styles.extractedTextInput,
                { marginBottom: keyboardVisible ? 10 : 0 },
              ]}
              value={extractedText || ''}
              onChangeText={(text) => setExtractedText(text)}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OCRMainScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.fourthbackgroound,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.fourthbackgroound,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.fourthbackgroound,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontFamily: fontfamily.SpaceMonoBold,
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  extractedTextInput: {
    backgroundColor: Colors.fourthbackgroound,
    padding: 10,
    borderWidth: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1,
  },
});
