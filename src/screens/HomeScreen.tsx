import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, PermissionsAndroid, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import CustomStatusBar from '../components/CustomStatusBar';
import { Colors, fontfamily, FontSizes } from '../styles/Globalcss';
import MainButton from '../components/MainButton';
import { launchCamera } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../navigation/BottomBarNavigator'
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';


type HomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList,'Main'> & BottomTabNavigationProp<BottomTabParamList,'Home'>


type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const userName = "Manav"

const HomeScreen = ( {navigation}: HomeScreenProps) => {
  
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
        (response) => {
          if (response.didCancel) {
            console.log('User canceled image capture');
          } else if (response.errorMessage) {
            console.error('Error: ', response.errorMessage);
          } else if (response.assets && response.assets[0]?.uri) {
            const newPhoto = response.assets[0].uri;
            const updatedPhotos = [...photos, newPhoto];
            setPhotos(updatedPhotos);
            setUpdatedPhotos(updatedPhotos); 
            setAlertVisible(true); 
          }
        }
      );
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 10, paddingBottom : 100 }}>
      <CustomStatusBar backgroundColor={Colors.primarybackground} translucent={false} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.helloText}>HELLO</Text>
          <Text style={styles.userNameText}>{userName}</Text>
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
            <View style={styles.FunContainer1} onTouchEnd={handleTakePhotos}>
              <Image source={require('../../assets/images/Text-OCR1.png')} style={styles.funImage} />
              <View style={styles.buttonWrapper}>
                <MainButton
                  title="Capture Photos"
                  Style={{ borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
                />
              </View>
            </View>
            <View style={styles.FunContainer3}>
              <Text style={styles.boxText}>Manav3</Text>
            </View>
          </View>
          <View style={styles.FunContainer2}>
            <Text style={styles.boxText}>Manav2</Text>
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
      <CustomAlert
        visible={alertVisible}
        onYes={() => {
          setAlertVisible(false);
          handleTakePhotos();
        }}
        onNo={() => {
          setAlertVisible(false);
          navigation.navigate('OCR', { screen: 'OCRMain', params: { photos: updatedPhotos } });
        }}
        onCancel={() => setAlertVisible(false)}
      />
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
    fontFamily: fontfamily.SpaceMonoRegular,
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
    flexDirection: 'column',
  },
  FunContainer1: {
    flex: 1,
    backgroundColor: Colors.fifthbackground,
    borderBottomColor: Colors.secondarytext,
    borderRadius: 15,
    position: 'relative',
    padding: 10,
  },
  FunContainer3: {
    flex: 1,
    backgroundColor: Colors.fifthbackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  FunContainer2: {
    flex: 1,
    backgroundColor: Colors.fifthbackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  boxText: {
    fontSize: FontSizes.medium,
    fontFamily: fontfamily.SpaceMonoBold,
    color: Colors.primartext,
  },
  funImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    borderRadius: 15,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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