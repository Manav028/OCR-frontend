import React, { useEffect, useState } from 'react';
import { StyleSheet,Text,View,TextInput,Alert,KeyboardAvoidingView,Platform,ScrollView,ActivityIndicator,Dimensions} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { Colors, fontfamily } from '../styles/Globalcss';
import MainButton from '../components/MainButton';

const OcrTranslationScreen = () => {

  const { imagePath, extractedText } = useSelector((state : any) => state.ocr);

  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * 0.25;

  const [editableText, setEditableText] = useState<string>(extractedText || ''); 
  const [translatedText, setTranslatedText] = useState<string | null>(null);
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
      Alert.alert('Error', 'Please select a language to translate.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/translate`,
        { text: editableText, targetLanguage },
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
    setEditableText(''); 
    setTranslatedText('');
    setTargetLanguage(null);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <CustomStatusBar backgroundColor={Colors.fourthbackgroound} />
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
              style={[styles.textBox, editableText ? styles.textBoxFilled : styles.textBoxEmpty , {maxHeight : maxHeight}]}
              value={editableText}
              onChangeText={(text) => setEditableText(text)} 
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
              style={[styles.textBox, translatedText ? styles.textBoxFilled : styles.textBoxEmpty, {maxHeight : maxHeight}]}
              value={translatedText || ''}
              onChangeText={setTranslatedText}
              multiline
            />
          </View>

          <View style={styles.buttonSection}>
            <MainButton title="Translate" Style={{ width: '48%' }} onPress={handleTranslate} />
            <MainButton title="Clear" Style={{ width: '48%' }} onPress={handleClearText} />
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
    paddingBottom : 50
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.fourthbackgroound,
  },
  screenTitle: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fontfamily.SpaceMonoBold,
  },
  textSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    fontFamily: fontfamily.SpaceMonoRegular,
  },
  textBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
  },
  textBoxFilled: {
    borderColor: 'black',
  },
  textBoxEmpty: {
    borderColor: 'black',
  },
  pickerSection: {
    marginBottom: 40,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'black',
    padding: 5,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderRadius: 10,
    color: Colors.thirdbackground,
    backgroundColor: Colors.fourthbackgroound,
    fontfamily: fontfamily.SpaceMonoRegular,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: Colors.thirdbackground,
    backgroundColor: Colors.fourthbackgroound,
    fontfamily: fontfamily.SpaceMonoRegular,
  },
};
