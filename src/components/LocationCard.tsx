import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface LocationCardProps {
  location: any;
  onPress: (location: any) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({location, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(location)}>
      <Image source={{uri: location.image}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{location.locationName}</Text>
        <Text style={styles.address}>{location.address}</Text>
        <Text style={styles.keywords}>
          추천 키워드: {location.recommendationKeywords.join(', ')}
        </Text>
        <Text style={styles.concept}>{location.concept}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#777',
  },
  keywords: {
    fontSize: 12,
    color: '#555',
    marginTop: 8,
  },
  concept: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
});

export default LocationCard;
