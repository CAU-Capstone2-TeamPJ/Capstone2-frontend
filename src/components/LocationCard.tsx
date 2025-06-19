import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import WebView from 'react-native-webview';
import {fetchPlaceDetails} from '../api/utils';
import PlaceItem from './PlaceItem';

interface LocationCardProps {
  location: any;
  onPress: (location: any) => void;
}

function extractPhotoReferenceFromUrl(url: string): string | undefined {
  const photoRefKey = 'photo_reference=';
  const keyParam = '&key=';

  const startIndex = url.indexOf(photoRefKey);
  const endIndex = url.indexOf(keyParam);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return undefined; // 필수 파라미터가 없거나 순서가 잘못된 경우
  }

  const photoRef = url.substring(startIndex + photoRefKey.length, endIndex);
  const newUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=AIzaSyD3xTB3LouXLK652qAPKYll2rhuwZEaMHo`;
  return newUrl;
}

const LocationCard: React.FC<LocationCardProps> = ({location, onPress}) => {
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const validNearbyKeywords = location?.nearbyKeywords?.filter(
    (kw: string) => kw?.trim() !== '',
  );

  const API_KEY = 'AIzaSyD3xTB3LouXLK652qAPKYll2rhuwZEaMHo';

  const renderPlaceLinks = (keyword: string) => {
    const placeIds = location?.nearbyPlaceIds?.[keyword]?.split(',') || [];

    // 2개씩 묶기 (chunk)
    const rows = [];
    for (let i = 0; i < placeIds.length; i += 2) {
      rows.push(placeIds.slice(i, i + 2));
    }

    return (
      <View style={{marginTop: 12}}>
        <Text style={{fontWeight: 'bold', marginBottom: 4}}>📍 {keyword}</Text>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
            }}>
            {row.map((placeId: string, colIndex: number) => (
              <View
                key={placeId}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  minWidth: 0,
                  flexShrink: 1,
                }}>
                <PlaceItem
                  placeId={placeId}
                  index={colIndex}
                  onSelect={pid => {
                    setSelectedPlaceId(pid);
                    setWebViewVisible(true);
                  }}
                  apiKey={API_KEY}
                />
              </View>
            ))}
            {row.length < 2 && <View style={{flex: 1}} />}
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => onPress(location)}>
        <Image
          source={{
            uri: extractPhotoReferenceFromUrl(
              location.images.length >= 2
                ? location.images[1]
                : location.images[0], // 또는 기본 이미지 URL
            ),
          }}
          style={styles.image}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{location.locationName}</Text>
          <Text style={styles.address}>{location.address}</Text>
          <Text style={styles.concept}>{location.concept}</Text>

          {validNearbyKeywords?.length > 0 &&
            validNearbyKeywords.every(
              (kw: string) =>
                location.nearbyPlaceIds?.[kw] &&
                !location.nearbyPlaceIds[kw].includes('dummy'),
            ) && (
              <>
                {validNearbyKeywords.map((kw: string, idx: number) => (
                  <View key={idx}>{renderPlaceLinks(kw)}</View>
                ))}
              </>
            )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={() => setWebViewVisible(false)}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{padding: 10, backgroundColor: '#009EFA'}}
            onPress={() => setWebViewVisible(false)}>
            <Text style={{color: 'white', textAlign: 'center'}}>닫기</Text>
          </TouchableOpacity>

          <WebView
            source={{
              uri: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${selectedPlaceId}`,
            }}
            style={{flex: 1}}
          />
        </View>
      </Modal>
    </>
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
    color: '#009EFA',
    marginTop: 4,
  },
});

export default LocationCard;
