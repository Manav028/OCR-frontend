import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; 
import CustomStatusBar from '../components/CustomStatusBar';
import { Colors } from '../styles/Globalcss';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetOCRData } from '../store/ocrtext/OcrTextSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { BottomTabBarButtonProps, BottomTabBarProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../navigation/BottomBarNavigator';
import { extractTextFromImageStorage , extracttextfrompdf } from '../services/ocrService';
import { useDispatch } from 'react-redux';

type ScannedItem = {
  name: string;
  date: string;
  type: string;
  thumbnail: string;
};

type StorageScreenNavigationProps = NativeStackScreenProps<AuthStackParamList,'Main'> & BottomTabNavigationProp<BottomTabParamList,'Storage'>

type StorageScreenProps = {
  navigation: StorageScreenNavigationProps;
}

const StorageScreen: React.FC<StorageScreenProps> = ({navigation}) => {
  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();

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

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchScannedData(token);
      }
    }, [token])
  );

  const fetchScannedData = useCallback(async (authToken: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/upload/user-documents`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data.data.map((item: any) => ({
        name: item.fileName,
        date: new Date(item.createdAt).toLocaleDateString(),
        type: item.fileType,
        thumbnail: item.fileUrl || 'https://example.com/default-thumbnail.png',
      }));

      setScannedData(data);
    } catch (error: any) {
      console.error('Error fetching scanned data:', error.message);
      Alert.alert('Error', 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProcessText = async (imagePath: string, isHandwriting: boolean) => {
      try {
        setLoading(true);
        const extractedText = await extractTextFromImageStorage(imagePath);
        dispatch(SetOCRData({ imagePath, extractedText }));
        navigation.navigate('OCR', { screen: 'OCRMain' });
      } catch (error) {
        console.error('Error processing text:', error);
        Alert.alert('Error', 'An error occurred while processing the image.');
      } finally {
        setLoading(false);
      }
    };

    const handleProcessPDFText = async (imagePath: string, isHandwriting: boolean) => {
      try {
        setLoading(true);
        console.log(imagePath)
        const extractedText = await extracttextfrompdf(imagePath);
        dispatch(SetOCRData({ imagePath, extractedText }));
        navigation.navigate('OCR', { screen: 'OCRMain' });
      } catch (error) {
        console.error('Error processing text:', error);
        Alert.alert('Error', 'An error occurred while processing the image.');
      } finally {
        setLoading(false);
      }
    };

  const onRefresh = async () => {
    if (token) {
      setRefreshing(true);
      await fetchScannedData(token);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: ScannedItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.type === 'image') {
          handleProcessText(item.thumbnail, false); 
        } else if (item.type === 'pdf') {
          handleProcessPDFText(item.thumbnail,false);
        } else {
          Alert.alert('Error', 'Unsupported file type.');
        }
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileDate}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreButtonText}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar
        backgroundColor={Colors.thirdbackground}
        translucent={false}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Storage</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <FlatList
          data={scannedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={[styles.listContent, {paddingBottom : 80}]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No data available</Text>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }/>

      )}
    </SafeAreaView>
  );
};

export default StorageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.thirdbackground,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fileDate: {
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    padding: 10,
  },
  moreButtonText: {
    fontSize: 20,
    color: '#888',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

