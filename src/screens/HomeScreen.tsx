import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, PermissionsAndroid, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import CustomStatusBar from '../components/CustomStatusBar';
import { Colors, fontfamily, FontSizes } from '../styles/Globalcss';
import MainButton from '../components/MainButton';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../navigation/BottomBarNavigator';
import { useFocusEffect } from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';

type HomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Main'> & BottomTabNavigationProp<BottomTabParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const userName = "Manav";

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [updatedPhotos, setUpdatedPhotos] = useState<string[]>([]);

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

  const handleTakePhotos = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      launchCamera(
        { mediaType: 'photo', saveToPhotos: true },
        async (response) => {
          if (response.didCancel) {
            console.log('User canceled image capture');
          } else if (response.errorMessage) {
            console.error('Error: ', response.errorMessage);
          } else if (response.assets && response.assets[0]?.uri) {
            try {

              const photoUri = response.assets[0].uri.startsWith('file://')
                ? response.assets[0].uri
                : `file://${response.assets[0].uri}`;

              console.log('Photo URI:', photoUri);

              const croppedImage = await ImageCropPicker.openCropper({
                mediaType: 'photo',
                path: photoUri,
                width: 300,
                height: 400,
                cropping: true,
              });

              setPhotos([croppedImage.path]);
              setUpdatedPhotos([croppedImage.path]);
              navigation.navigate('OCR', { screen: 'OCRMain', params: { photos: [croppedImage.path] } });
            } catch (err) {
              console.error('Cropper Error:', err);
            }
          }
        }
      );
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
    }
  };


  const handleSelectFromLibrary = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User canceled image selection');
      } else if (response.errorMessage) {
        console.error('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedPhotos = response.assets.map((asset) => asset.uri || '');
        setPhotos(selectedPhotos);
        navigation.navigate('OCR', { screen: 'OCRMain', params: { photos: selectedPhotos } });
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setPhotos([]);
      setUpdatedPhotos([]);
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 10, paddingBottom: 100 }}>
      <CustomStatusBar backgroundColor={Colors.primarybackground} translucent={false} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.helloText}>HELLO</Text>
          <Text style={styles.userNameText}>{userName},</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/ocr-background.jpeg')}
            style={styles.image}
          />
          <View style={styles.buttonContainer}>
            <MainButton
              title="JUST FOR YOU"
              touchable={false}
              textColor={Colors.primartext}
              Style={{ paddingHorizontal: 20, backgroundColor: Colors.primarybackground, paddingVertical: 7 }}
            />
          </View>
          <View style={styles.buttonContainerOCR}>
            <MainButton
              title="OCR ->"
              touchable={false}
              textColor={Colors.primartext}
              Style={{ paddingHorizontal: 20, backgroundColor: Colors.primarybackground, paddingVertical: 7 }}
            />
          </View>
        </View>

        <View style={styles.FuncContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.FunContainer1}>
              <Text style={styles.boxText}>Camera</Text>
            </View>
            <View style={styles.FunContainer1}>
              <Text style={styles.boxText}>Gallery</Text>
            </View>
          </View>
          <View style={styles.columnContainer}>
            <View style={styles.FunContainer1}>
              <Text style={styles.boxText}>PDF</Text>
            </View>
            <View style={styles.FunContainer1}>
              <Text style={styles.boxText}>Human Handwritting</Text>
            </View>
          </View>
        </View>

        {photos.length > 0 && (
          <View style={styles.photoContainer}>
            <Text style={styles.photoHeading}>Captured Photos:</Text>
            <FlatList
              data={photos}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.photoItem}>
                  <Image source={{ uri: item }} style={styles.photoPreview} />
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  welcomeContainer: {
    backgroundColor: Colors.primarybackground,
    alignItems: 'center',
    shadowColor: Colors.primaryshadowcolor,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    gap: '7',
  },
  helloText: {
    fontSize: FontSizes.large,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.primartext,
  },
  userNameText: {
    fontSize: FontSizes.large,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.secondarytext,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: -20,
  },
  image: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    alignSelf: 'center',
  },
  buttonContainerOCR: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    alignSelf: 'center',
  },
  FuncContainer: {
    width: '100%',
    height: 380,
    flexDirection: 'row',
    marginTop: -30,
    gap: 7,
  },
  columnContainer: {
    flex: 1,
    gap: 7,
    flexDirection: 'column'
  },
  FunContainer1: {
    flex: 1,
    backgroundColor: Colors.fifthbackground,
    borderBottomColor: Colors.secondarytext,
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: FontSizes.medium,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.primartext,
  },
  funImage: {
    width: '60%',
    height: '50%',
    resizeMode: 'contain',
    borderRadius: 15,
    marginBottom: 24,
  },
  photoContainer: {
    marginTop: 20,
  },
  photoHeading: {
    fontSize: FontSizes.medium,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.primartext,
    marginBottom: 10,
  },
  photoItem: {
    marginRight: 10,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
