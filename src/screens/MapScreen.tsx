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
import HeaderBar from '../components/HeaderBar';
import SideSheet from '../components/SideSheet';
import {RootStackParamList} from '../../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const events = [
  {
    date: '1일차',
    places: [
      {latitude: 37.5665, longitude: 126.978, title: '서울시청'},
      {latitude: 37.57, longitude: 126.983, title: '경복궁'},
    ],
  },
  {
    date: '2일차',
    places: [
      {latitude: 37.5765, longitude: 126.985, title: '북촌한옥마을'},
      {latitude: 37.5598, longitude: 126.9751, title: '남대문시장'},
    ],
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

const MapScreen: React.FC<Props> = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState<string>('1일차');
  const [sideVisible, setSideVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  const selectedEvents = events.find(event => event.date === selectedDate) || {
    places: [],
  };

  useEffect(() => {
    if (selectedEvents.places.length > 0) {
      const coords = selectedEvents.places.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [selectedDate]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderBar
        title="일정"
        onMenuPress={() => setSideVisible(true)}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.978,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          zoomEnabled
          zoomControlEnabled>
          {selectedEvents.places.map((coord, index) => (
            <Marker
              key={`${coord.latitude}-${coord.longitude}`}
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
      </View>
      <SideSheet
        visible={sideVisible}
        onClose={() => setSideVisible(false)}
        events={events}
        onSelectDate={setSelectedDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
