import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, Image, View, StyleSheet} from 'react-native';
import {fetchPlaceDetails} from '../api/utils';

interface PlaceItemProps {
  placeId: string;
  index: number;
  onSelect: (placeId: string) => void;
  apiKey: string;
}

const PlaceItem: React.FC<PlaceItemProps> = ({
  placeId,
  index,
  onSelect,
  apiKey,
}) => {
  const [placeData, setPlaceData] = useState<{
    name?: string;
    photoRef?: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const details = await fetchPlaceDetails(placeId, apiKey);
        setPlaceData({
          name: details.name,
          photoRef: details.photos?.[0]?.photo_reference,
        });
      } catch (error) {
        console.warn('Failed to fetch place details:', error);
      }
    })();
  }, [placeId]);

  const imageUrl = placeData?.photoRef
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeData.photoRef}&key=${apiKey}`
    : null;

  return (
    <TouchableOpacity
      onPress={() => onSelect(placeId)}
      style={styles.item}
      activeOpacity={0.8}>
      {imageUrl && <Image source={{uri: imageUrl}} style={styles.image} />}
      <View style={styles.textWrapper}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.placeName}>
          {placeData?.name || `장소 ${index + 1}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flex: 1,
    minWidth: 0,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  textWrapper: {
    flex: 1,
    minWidth: 0,
  },
  placeName: {
    fontSize: 14,
    color: '#333',
  },
});

export default PlaceItem;
