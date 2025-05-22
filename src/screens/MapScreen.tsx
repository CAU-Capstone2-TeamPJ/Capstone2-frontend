import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Dimensions, Text, SafeAreaView} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import HeaderBar from '../components/HeaderBar';
import SideSheet from '../components/SideSheet';
import {RootStackParamList} from '../../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

interface EventPlace {
  latitude: number;
  longitude: number;
  title: string;
}

interface EventDay {
  date: string;
  places: EventPlace[];
}

const MapScreen: React.FC<Props> = ({navigation, route}) => {
  const {events} = route.params;

  // 'all'은 전체 일정을 의미
  const [selectedDate, setSelectedDate] = useState<string | 'all'>(
    events[0]?.date || '',
  );

  const [sideVisible, setSideVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  // 전체 일정의 모든 장소를 합침
  const allPlaces: EventPlace[] = events.flatMap(event => event.places);

  // 선택된 일정에 따라 표시할 장소 결정
  const selectedPlaces =
    selectedDate === 'all'
      ? allPlaces
      : events.find(event => event.date === selectedDate)?.places || [];

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapReady && mapRef.current && selectedPlaces.length > 0) {
      const coords = selectedPlaces.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [mapReady, selectedPlaces]);

  // 장소를 클릭했을 때 해당 장소로 이동
  const handleSelectPlace = (place: EventPlace) => {
    mapRef.current?.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500,
    );
  };

  // 초기 지점 설정 (전체 일정 선택 시 첫 장소 기준)
  const initialPlace = selectedPlaces[0] || events[0]?.places[0];

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderBar
        title={selectedDate === 'all' ? '전체 일정' : selectedDate}
        onMenuPress={() => setSideVisible(true)}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {initialPlace && (
          <MapView
            ref={mapRef}
            style={styles.map}
            onMapReady={() => setMapReady(true)}
            showsUserLocation
            zoomEnabled
            zoomControlEnabled
            initialRegion={{
              latitude: initialPlace.latitude,
              longitude: initialPlace.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            {selectedPlaces.map((coord, index) => (
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
            {selectedPlaces.length > 0 && (
              <Polyline
                coordinates={selectedPlaces}
                strokeWidth={4}
                strokeColor="blue"
              />
            )}
          </MapView>
        )}
      </View>

      <SideSheet
        visible={sideVisible}
        onClose={() => setSideVisible(false)}
        events={events}
        onSelectDate={setSelectedDate}
        onSelectPlace={handleSelectPlace}
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
});

export default MapScreen;
