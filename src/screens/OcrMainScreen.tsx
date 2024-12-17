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
import { useSelector, useDispatch } from 'react-redux';
import { SetOCRData } from '../store/ocrtext/OcrTextSlice';
import Clipboard from '@react-native-clipboard/clipboard';
import { Colors, fontfamily } from '../styles/Globalcss';
import CustomStatusBar from '../components/CustomStatusBar';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const OCRMainScreen: React.FC = () => {
  const dispatch = useDispatch();

  const { imagePath, extractedText } = useSelector((state : any) => state.ocr);

  const [localText, setLocalText] = useState<string>(extractedText || '');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setLocalText(extractedText || '');
  }, [extractedText]);

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
      <CustomStatusBar backgroundColor={Colors.fourthbackgroound} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: keyboardVisible ? 0 : 70 },
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
              style={[styles.extractedTextInput, { marginBottom: keyboardVisible ? 10 : 0 }]}
              value={localText}
              onChangeText={(text) => {
                setLocalText(text);
                // dispatch(SetOCRData({ imagePath, extractedText: text }));
              }}
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
  imagePathText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.primaryborder,
  },
});