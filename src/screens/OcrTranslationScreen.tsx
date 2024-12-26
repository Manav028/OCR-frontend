import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { Colors, fontfamily } from '../styles/Globalcss';
import MainButton from '../components/MainButton';

const OcrTranslationScreen = () => {
  const { imagePath, extractedText } = useSelector((state: any) => state.ocr);

  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * 0.25;

  const [editableText, setEditableText] = useState<string>(extractedText || '');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditableText(extractedText || '');
  }, [extractedText]);

  const handleTranslate = async () => {
    if (!editableText.trim()) {
      Alert.alert('Error', 'No text available to translate.');
      return;
    }

    if (!targetLanguage) {
      Alert.alert('Error', 'Please select a target language to translate.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/translate`,
        { text: editableText, sourceLanguage, targetLanguage },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setTranslatedText(response.data.translated);
    } catch (error: any) {
      console.error('Translation Error:', error.message);
      Alert.alert('Error', 'Failed to translate text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <CustomStatusBar backgroundColor="black" barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.textSection}>
            <Text style={styles.sectionTitle}>Extracted Text</Text>
            <TextInput
              style={[
                styles.textBox,
                editableText ? styles.textBoxFilled : styles.textBoxEmpty,
                { maxHeight: maxHeight },
              ]}
              value={editableText}
              onChangeText={(text) => setEditableText(text)}
              multiline
            />
          </View>

          
          <View style={styles.languageButtonsSection}>
            <View style={styles.languageButtonContainer}>
              <Text style={styles.sectionTitle}>Translate From</Text>
              <RNPickerSelect
                onValueChange={(value) => setSourceLanguage(value)}
                items={[
                  { label: 'English', value: 'en' },
                  { label: 'Spanish', value: 'es' },
                  { label: 'French', value: 'fr' },
                  { label: 'German', value: 'de' },
                  { label: 'Chinese', value: 'zh' },
                  { label: 'Hindi', value: 'hi' },
                ]}
                value={sourceLanguage}
                placeholder={{ label: 'Source Language', value: null }}
                style={pickerStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            <View style={styles.languageButtonContainer}>
              <Text style={styles.sectionTitle}>Translate To</Text>
              <RNPickerSelect
                onValueChange={(value) => setTargetLanguage(value)}
                items={[
                  { label: 'English', value: 'en' },
                  { label: 'Spanish', value: 'es' },
                  { label: 'French', value: 'fr' },
                  { label: 'German', value: 'de' },
                  { label: 'Chinese', value: 'zh' },
                  { label: 'Hindi', value: 'hi' },
                ]}
                value={targetLanguage}
                placeholder={{ label: 'Target Language', value: null }}
                style={pickerStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          
          <View style={styles.buttonSection}>
            <MainButton
              title='Translate'
              Style={{ width: '100%' }}
              onPress={handleTranslate}
              loading={loading}
            />
          </View>

          {translatedText && (
            <View style={styles.textSection}>
              <Text style={styles.sectionTitle}>Translated Text</Text>
              <TextInput
                style={[
                  styles.nonEditableTextBox,
                  { minHeight: 150 }, 
                ]}
                value={translatedText || ''}
                editable={false}
                multiline
              />
              <Text style={styles.readOnlyText}>* This text is read-only</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OcrTranslationScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingBottom: 50
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
  },
  languageButtonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageButtonContainer: {
    width: '48%',
  },
  textSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#444',
    marginBottom: 10,
  },
  textBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
  },
  nonEditableTextBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#f0f0f0', 
    borderColor: 'gray',
  },
  readOnlyText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    fontStyle: 'italic',
  },
  textBoxFilled: {
    borderColor: 'black',
  },
  textBoxEmpty: {
    borderColor: 'black',
  },
  buttonSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: Colors.thirdbackground,
    borderWidth: 2,
    borderColor: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: Colors.thirdbackground,
    borderWidth: 2,
    borderColor: 'black',
  },
};
