import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Share,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';

const OCRMainScreen: React.FC = () => {
  const { extractedText } = useSelector((state: any) => state.ocr);

  const HeightScreen = Dimensions.get('screen').height;

  const [localText, setLocalText] = useState<string>(extractedText || '');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setLocalText(extractedText || '');
  }, [extractedText]);

  const copyToClipboard = () => {
    if (localText) {
      Clipboard.setString(localText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } else {
      Alert.alert('Nothing to Copy', 'No text available to copy.');
    }
  };

  const shareText = async () => {
    if (localText) {
      try {
        await Share.share({
          message: localText,
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
      <CustomStatusBar backgroundColor="black" barStyle="light-content" />
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <View style={styles.cardContainer}>
          <ScrollView style={{ height: HeightScreen - 300 }} nestedScrollEnabled>
            <TextInput
              style={styles.textInput}
              value={localText}
              onChangeText={setLocalText}
              placeholder="Extracted text will appear here"
              placeholderTextColor="gray"
              multiline
            />
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          {copied ? (
            <View style={styles.button}>
              <Icon name="checkmark-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Copied</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
              <Icon name="copy-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Copy</Text>
            </TouchableOpacity>
          )}
          {shared ? (
            <View style={styles.button}>
              <Icon name="checkmark-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Shared</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={shareText}>
              <Icon name="share-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OCRMainScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    width: '100%',
    borderRadius: 15,
    padding: 15,
    shadowRadius: 5,
    borderColor: '#E4E0E1',
    borderWidth: 2,
  },
  textInput: {
    color: 'black',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    width: '40%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});
