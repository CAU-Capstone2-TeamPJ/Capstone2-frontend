import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

type Coordinate = {
  latitude: number;
  longitude: number;
  title: string;
};

const coordinates: Coordinate[] = [
  { latitude: 37.5665, longitude: 126.9780, title: '서울시청' },
  { latitude: 37.5700, longitude: 126.9830, title: '경복궁' },
  { latitude: 37.5765, longitude: 126.9850, title: '북촌한옥마을' },
  { latitude: 37.5598, longitude: 126.9751, title: '남대문시장' },
  { latitude: 37.5512, longitude: 126.9882, title: 'N서울타워' },
  { latitude: 37.5640, longitude: 127.0010, title: '동대문디자인플라자' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        zoomEnabled
        zoomControlEnabled
        showsUserLocation
      >
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: coord.latitude,
              longitude: coord.longitude,
            }}
            title={coord.title} // ✅ 마커 눌렀을 때 장소 이름 팝업
          >
            <View style={styles.customMarker}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}

        <Polyline
          coordinates={coordinates}
          strokeWidth={4}
          strokeColor="blue"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  customMarker: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'blue',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markerText: {
    fontWeight: 'bold',
    color: 'blue',
  },
});
