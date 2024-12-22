import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { Colors } from '../styles/Globalcss'; // Assuming Colors is predefined

// Define the type for a scanned item
type ScannedItem = {
  id: string;
  name: string;
  date: string;
  type: string;
  thumbnail: any; // Replace with ImageSourcePropType if you're using proper image sources
};

const StorageScreen: React.FC = () => {
  const scannedData: ScannedItem[] = [
    {
      id: '1',
      name: 'Document1.pdf',
      date: 'Dec 21, 2024',
      type: 'PDF',
      thumbnail: require('../../assets/images/camera.png'),
    },
    {
      id: '2',
      name: 'Image1.jpg',
      date: 'Dec 20, 2024',
      type: 'Image',
      thumbnail: require('../../assets/images/camera.png'),
    },
    
  ];

  const renderItem: ListRenderItem<ScannedItem> = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.thumbnail} style={styles.thumbnail} />
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
      <CustomStatusBar backgroundColor={Colors.thirdbackground} translucent={false} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Storage</Text>
        
      </View>
      <FlatList
        data={scannedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  scanButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});
