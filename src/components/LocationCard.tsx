import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface LocationCardProps {
  location: any;
  onPress: (location: any) => void;
}

function extractPhotoReferenceFromUrl(url: string): string | null {
  const photoRefKey = 'photo_reference=';
  const keyParam = '&key=';

  const startIndex = url.indexOf(photoRefKey);
  const endIndex = url.indexOf(keyParam);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null; // 필수 파라미터가 없거나 순서가 잘못된 경우
  }

  const photoRef = url.substring(startIndex + photoRefKey.length, endIndex);
  const newUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=AIzaSyD3xTB3LouXLK652qAPKYll2rhuwZEaMHo`;

  console.log('Extracted:', newUrl);
  return newUrl;
}

const LocationCard: React.FC<LocationCardProps> = ({location, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(location)}>
      <Image
        source={{
          uri: `${extractPhotoReferenceFromUrl(location.images[1])}`,
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{location.locationName}</Text>
        <Text style={styles.address}>{location.address}</Text>
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
