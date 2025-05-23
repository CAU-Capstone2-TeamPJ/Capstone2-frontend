import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import LocationCard from './LocationCard';

interface Location {
  locationId: number;
  locationName: string;
  address: string;
  images: string[];
  recommendationKeywords: string[];
  concept: string;
}

interface LocationListProps {
  locations: Location[];
  onPress: (location: any) => void; // 클릭 시 이벤트 핸들러
}

const LocationList: React.FC<LocationListProps> = ({locations, onPress}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {locations.map((location, index) => (
          <View key={location.locationId} style={styles.locationContainer}>
            <Text style={styles.indexText}>{index + 1}번째 장소</Text>
            <LocationCard location={location} onPress={onPress} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  locationContainer: {
    marginBottom: 16,
  },
  indexText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
});

export default LocationList;
