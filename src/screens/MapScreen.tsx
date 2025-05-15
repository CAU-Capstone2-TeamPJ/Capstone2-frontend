import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

type Coordinate = {
  latitude: number;
  longitude: number;
  title: string;
};

const coordinates: Coordinate[] = [
  {latitude: 37.5665, longitude: 126.978, title: '서울시청'},
  {latitude: 37.57, longitude: 126.983, title: '경복궁'},
  {latitude: 37.5765, longitude: 126.985, title: '북촌한옥마을'},
  {latitude: 37.5598, longitude: 126.9751, title: '남대문시장'},
  {latitude: 37.5512, longitude: 126.9882, title: 'N서울타워'},
  {latitude: 37.564, longitude: 127.001, title: '동대문디자인플라자'},
];

const events = [
  {
    date: '2025-05-15',
    places: [
      {latitude: 37.5665, longitude: 126.978, title: '서울시청'},
      {latitude: 37.57, longitude: 126.983, title: '경복궁'},
    ],
  },
  {
    date: '2025-05-16',
    places: [
      {latitude: 37.5765, longitude: 126.985, title: '북촌한옥마을'},
      {latitude: 37.5598, longitude: 126.9751, title: '남대문시장'},
    ],
  },
];

const MapScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2025-05-15');
  const mapRef = useRef<MapView>(null);

  const selectedEvents = events.find(event => event.date === selectedDate) || {
    places: [],
  }; // 기본값 설정

  useEffect(() => {
    if (selectedEvents && selectedEvents.places.length > 0) {
      const coordinates = selectedEvents.places.map(place => ({
        latitude: place.latitude,
        longitude: place.longitude,
      }));

      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [selectedDate, selectedEvents]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/* 상단바 */}
        <View style={styles.header}>
          <Text style={styles.headerText}>일정</Text>
        </View>

        {/* 지도 */}
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.978,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          zoomEnabled
          zoomControlEnabled
          showsUserLocation>
          {selectedEvents.places.map((coord, index) => (
            <Marker
              key={`${coord.latitude}-${coord.longitude}`} // 고유 키 사용
              coordinate={{
                latitude: coord.latitude,
                longitude: coord.longitude,
              }}
              title={coord.title}>
              <View style={styles.customMarker}>
                <Text style={styles.markerText}>{index + 1}</Text>
              </View>
            </Marker>
          ))}
          {selectedEvents.places.length > 0 && (
            <Polyline
              coordinates={selectedEvents.places}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
        </MapView>

        {/* 날짜별 일정 선택 */}
        <FlatList
          data={events}
          horizontal
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => setSelectedDate(item.date)}>
              <View style={styles.dateButton}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.date + index} // 고유 키 결합
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 50,
  },
  header: {
    backgroundColor: '#f4511e',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  dateButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
});

export default MapScreen;
