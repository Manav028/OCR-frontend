import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, PermissionsAndroid, FlatList, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, fontfamily, FontSizes } from '../styles/Globalcss';
import MainButton from '../components/MainButton';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../navigation/BottomBarNavigator';
import { useFocusEffect } from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { extractTextFromHandwriting, extractTextFromImage } from '../services/ocrService';
import { useDispatch } from 'react-redux';
import { SetOCRData } from '../store/ocrtext/OcrTextSlice';
import axios from 'axios';
import { API_URL } from '@env';
import DocumentPicker from 'react-native-document-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomStatusBar from '../components/CustomStatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Main'> & BottomTabNavigationProp<BottomTabParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const dispatch = useDispatch();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [handwrittenModalVisible, setHandwrittenModalVisible] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    fetchToken();
  }, []);


  const ImageExtension = (imagePath: string): string => {
    const extension = imagePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
  };

  const uploadFile = async (formData: FormData): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleProcessText = async (imagePath: string, isHandwriting: boolean) => {
    try {
      setLoading(true);
      const extractedText = isHandwriting
        ? await extractTextFromHandwriting(imagePath)
        : await extractTextFromImage(imagePath);

      const ImageExt = ImageExtension(imagePath);

      const formData = new FormData();
      formData.append('document', {
        uri: imagePath.startsWith('file://') ? imagePath : `file://${imagePath}`,
        type: ImageExt,
        name: `ocr_image_${Date.now()}.${ImageExt.split('/')[1]}`,
      });
      formData.append('fileType', 'image');
      const uploadResponse = await uploadFile(formData);

      dispatch(SetOCRData({ imagePath, extractedText }));
      navigation.navigate('OCR', { screen: 'OCRMain' });
    } catch (error) {
      console.error('Error processing text:', error);
      Alert.alert('Error', 'An error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app requires access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleTakePhotos = async (isHandwriting: boolean) => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      launchCamera({ mediaType: 'photo', saveToPhotos: true }, async (response) => {
        if (response.didCancel || response.errorMessage) {
          console.log('Image capture canceled or failed');
        } else if (response.assets && response.assets[0]?.uri) {
          try {
            setLoading(true);
            const photoUri = `file://${response.assets[0].uri}`;
            const croppedImage = await ImageCropPicker.openCropper({
              mediaType: 'photo',
              path: photoUri,
              width: 300,
              height: 400,
              cropping: true,
            });
            await handleProcessText(croppedImage.path, isHandwriting);
          } catch (err) {
            console.error('Cropper Error:', err);
          } finally {
            setLoading(false);
          }
        }
      });
    }
  };

  const handlepickPDF = async () => {
    try {
      setLoading(true);

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const fileUri = res[0]?.uri;

      const extractFormData = new FormData();
      extractFormData.append('file', {
        uri: fileUri,
        type: 'application/pdf',
        name: res[0]?.name || 'document.pdf',
      });

      const response = await axios.post(`${API_URL}/api/pdf/ocr`, extractFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const extractedText = response.data.text;


      console.log(token)

      const uploadFormData = new FormData();
      uploadFormData.append('document', {
        uri: fileUri,
        type: 'application/pdf',
        name: res[0]?.name || 'document.pdf',
      });
      uploadFormData.append('fileType', 'pdf');

      const uploadResponse = await axios.post(`${API_URL}/api/upload`, uploadFormData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Upload Response:', uploadResponse.data);

      dispatch(SetOCRData({ imagePath: fileUri, extractedText }));
      navigation.navigate('OCR', { screen: 'OCRMain' });
    } catch (err) {
      console.error('PDF Error:', err);
      Alert.alert('Error', 'Failed to process PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handlepickImage = async (isHandwriting: boolean) => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async (response) => {
      if (response.didCancel) {
        console.log('User canceled image selection');
      } else if (response.errorMessage) {
        console.error('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const photoUri = response.assets[0]?.uri || '';

        try {
          setLoading(true);

          const croppedImage = await ImageCropPicker.openCropper({
            mediaType: 'photo',
            path: photoUri,
            width: 300,
            height: 400,
            cropping: true,
          });

          console.log('Cropped Image Path:', croppedImage.path);
          setPhotos([croppedImage.path]);
          await handleProcessText(croppedImage.path, isHandwriting);
        } catch (cropError) {
          console.error('Error while cropping image:', cropError);
          Alert.alert('Error', 'Failed to crop the image.');
        } finally {
          setLoading(false);
        }
      }
    });
  };


  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleCameraPress = () => {
    handleModalClose();
    handleTakePhotos(false);
  };

  const handleGalleryPress = () => {
    handleModalClose();
    handlepickImage(false);
  };

  const handleHandwrittenPhotoPress = () => {
    handleModalClose();
    handlepickImage(true)
  };

  useFocusEffect(
    React.useCallback(() => {
      setPhotos([]);
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <CustomStatusBar backgroundColor={Colors.thirdbackground} translucent={false} barStyle="light-content" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.helloText}>Hello</Text>
          <Text style={styles.userNameText}>Manav,</Text>
        </View>

        <View style={styles.TextContainer}>
          <Text style={[styles.Textstyle, { fontWeight: '600' }]}>Convert Image</Text>
          <Text style={styles.Textstyle}>Into Text</Text>
        </View>

        <View style={{ paddingHorizontal: 30 }}>
          <View style={styles.imageSection}>
            <Image
              source={require('../../assets/images/ocr-Main-screen.png')}
              style={styles.xlsImage}
              resizeMode="contain"
            />
          </View>

          <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
            <Text style={styles.smallTextstyle}>100% Automatically and Fast</Text>
          </View>

          <View style={{ marginTop: 30, gap: 10, paddingBottom: 100 }}>
            <MainButton title="+ Upload Image" onPress={() => setModalVisible(true)} />
            <MainButton title="+ Upload PDF" onPress={handlepickPDF} />
            <MainButton title="+ Upload Handwritten Image" onPress={() => setHandwrittenModalVisible(true)} />
            <Text style={styles.smallTextstyle}>Just solve your image-to-text problem with one click</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <TouchableOpacity onPress={handleModalClose} >
                <Ionicons name="close-outline" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20, width: '100%', alignItems: 'center' }}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCameraPress}>
                <Ionicons name='camera-outline' color="black" style={{ fontSize: 30 }} />
                <Text style={styles.modalButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleGalleryPress}>
                <Ionicons name='image-outline' color="black" style={{ fontSize: 30 }} />
                <Text style={styles.modalButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={handwrittenModalVisible}
        onRequestClose={() => setHandwrittenModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <TouchableOpacity onPress={() => setHandwrittenModalVisible(false)}>
                <Ionicons name="close-outline" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20, width: '100%', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setHandwrittenModalVisible(false);
                  handleTakePhotos(true);
                }}>
                <Ionicons name="camera-outline" color="black" style={{ fontSize: 30 }} />
                <Text style={styles.modalButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setHandwrittenModalVisible(false);
                  handlepickImage(true);
                }}>
                  <Ionicons name="image-outline" color="black" style={{ fontSize: 30 }} />
                <Text style={styles.modalButtonText}>Select from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && (
  <Modal
    transparent={true}
    animationType="fade"
    visible={loading}
    onRequestClose={() => {}}
  >
    <View style={styles.loaderOverlay}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.thirdbackground} />
        <Text style={styles.loaderText}>Processing...</Text>
      </View>
    </View>
  </Modal>
)}
      
    </SafeAreaView>
  );
};


export default HomeScreen;

const styles = StyleSheet.create({
  welcomeContainer: {
    backgroundColor: Colors.thirdbackground,
    alignItems: 'center',
    shadowColor: Colors.primaryshadowcolor,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    gap: '7',
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontWeight: 'bold'
  },
  helloText: {
    fontSize: FontSizes.large,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.thirdtext,
  },
  userNameText: {
    fontSize: FontSizes.large,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.thirdtext,
  },
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  arrow: {
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#000',
  },
  xlsImage: {
    width: 350,
    height: 150,
  },
  imagesec1: {
    transform: [{ rotate: '345deg' }]
  },
  imagesec2: {
    transform: [{ rotate: '270deg' }]
  },
  TextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  Textstyle: {
    fontFamily: fontfamily.SpaceMonoBold,
    fontSize: 38,
    textAlign: 'center',


  },
  smallTextstyle: {
    fontFamily: fontfamily.SpaceMonoBold,
    fontSize: 17,
    textAlign: 'center',
    color: 'gray',
    marginTop: 10
  },
  smallTextstyle2: {
    fontFamily: fontfamily.SpaceMonoBold,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.thirdtext,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 8,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'white',
    borderColor: '#E4E0E1',
    borderWidth: 2
  },
  modalButtonText: {
    fontSize: 18,
    fontFamily: fontfamily.SpaceMonoBold,
    color: 'black',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: Colors.secondarybackground,
    paddingVertical: 10,
    borderRadius: 8,
    width: '50%',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: FontSizes.medium,
    fontFamily: fontfamily.SpaceMonoRegular,
    color: Colors.thirdtext,
  },
  textWithBackground: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '30%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'contain'
  },
  modalHeader: {
    backgroundColor: 'black',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  loaderContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'white', // Background color for the loader
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.thirdtext,
    textAlign: 'center',
  },
  
});
