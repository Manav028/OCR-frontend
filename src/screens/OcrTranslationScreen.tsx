import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { RemoveOCRText } from '../store/ocrtext/OcrTextSlice';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { Colors } from '../styles/Globalcss';

const OcrTranslationScreen = () => {
  const OCRtextFromState = useSelector((state: any) => state.extractedText);

  const [OCRtext, setOCRtext] = useState<string>(OCRtextFromState || '');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleTranslate = async () => {
    if (!OCRtext.trim()) {
      Alert.alert('Error', 'No text available to translate.');
      return;
    }

    if (!targetLanguage) {
      Alert.alert('Error', 'Please select a language to translate.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/translate`,
        { text: OCRtext, targetLanguage },
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

  const handleClearText = () => {
    setOCRtext('');
    setTranslatedText('');
    setTargetLanguage(null);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <CustomStatusBar backgroundColor={Colors.fourthbackgroound}/>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>OCR Translation</Text>

          <View style={styles.textSection}>
            <Text style={styles.sectionTitle}>Extracted Text</Text>
            <TextInput
              style={[styles.textBox, OCRtext ? styles.textBoxFilled : styles.textBoxEmpty]}
              value={OCRtext}
              onChangeText={setOCRtext}
              multiline
            />
          </View>

          <View style={styles.pickerSection}>
            <Text style={styles.sectionTitle}>Translate To</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setTargetLanguage(value)}
                items={[
                  { label: 'Spanish', value: 'es' },
                  { label: 'French', value: 'fr' },
                  { label: 'German', value: 'de' },
                  { label: 'Chinese', value: 'zh' },
                  { label: 'Hindi', value: 'hi' },
                ]}
                value={targetLanguage}
                placeholder={{ label: 'Please select a language...', value: null }}
                style={pickerStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          <View style={styles.textSection}>
            <Text style={styles.sectionTitle}>Translated Text</Text>
            <TextInput
              style={[styles.textBox, translatedText ? styles.textBoxFilled : styles.textBoxEmpty]}
              value={translatedText || ''}
              onChangeText={setTranslatedText}
              multiline
            />
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.button} onPress={handleTranslate} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Translating...' : 'Translate'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={handleClearText}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OcrTranslationScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  textSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  textBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    minHeight: 120,
  },
  textBoxFilled: {
    borderColor: '#007bff',
    color: '#333',
  },
  textBoxEmpty: {
    borderColor: '#ccc',
    color: '#999',
  },
  pickerSection: {
    marginBottom: 40,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    padding: 5,
    backgroundColor: '#fff',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#007bff',
    color: '#333',
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#007bff',
    color: '#333',
    backgroundColor: '#fff',
  },
};
