import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import MainButton from '../components/MainButton';

const OCRSummaryScreen = () => {
  const { extractedText } = useSelector((state: any) => state.ocr);

  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * 0.25;

  const [editableText, setEditableText] = useState<string>(extractedText || '');
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!editableText.trim()) {
      Alert.alert('Error', 'No text available to summarize.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/chatgpt/summary`,
        { text: editableText },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const summary = response.data.summary;
      setSummaryText(summary);
    } catch (error: any) {
      console.error('Summarization Error:', error.message);
      Alert.alert('Error', 'Failed to summarize text.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearText = () => {
    setSummaryText('');
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <CustomStatusBar backgroundColor="black" barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.textSection}>
            <Text style={styles.sectionTitle}>Extracted Text</Text>
            <View style={styles.cardContainer}>
              <ScrollView style={{ height: maxHeight }} nestedScrollEnabled>
                <TextInput
                  style={styles.textInput}
                  value={editableText}
                  onChangeText={(text) => setEditableText(text)}
                  multiline
                />
              </ScrollView>
            </View>
          </View>

          <View style={styles.buttonSection}>
            <MainButton
              title="Summary"
              Style={{ width: '48%' }}
              onPress={handleSummarize}
              loading={loading} // Use loading prop here
            />
            <MainButton
              title="Clear"
              Style={{ width: '48%' }}
              onPress={handleClearText}
            />
          </View>

          {summaryText && (
            <View style={styles.textSection}>
              <Text style={styles.sectionTitle}>Summary Text</Text>
              <View style={styles.cardContainer}>
                <ScrollView style={{ height: maxHeight }} nestedScrollEnabled>
                  <TextInput
                    style={[styles.textInput, styles.nonEditableText]}
                    value={summaryText || ''}
                    editable={false} // Make the TextInput non-editable
                    multiline
                  />
                </ScrollView>
              </View>
              <Text style={styles.readOnlyHint}>* This text is read-only</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OCRSummaryScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
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
  textInput: {
    color: 'black',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  cardContainer: {
    width: '100%',
    borderRadius: 15,
    padding: 15,
    shadowRadius: 5,
    borderColor: '#E4E0E1',
    borderWidth: 2,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nonEditableText: {
    backgroundColor: '#f0f0f0', // Light gray background to indicate non-editable
    color: '#666', // Subtle text color
    borderColor: '#ccc', // Softer border
  },
  readOnlyHint: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
