import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Dimensions, Text, SafeAreaView} from 'react-native';
import MapView, {Marker, Polyline, Circle} from 'react-native-maps';
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

  const [selectedDate, setSelectedDate] = useState<string | 'all' | null>(null);
  const [sideVisible, setSideVisible] = useState(false);
  const [circleVisible, setCircleVisible] = useState(true);
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const allPlaces: EventPlace[] = events.flatMap(event => event.places);
  const selectedPlaces =
    selectedDate === 'all'
      ? allPlaces
      : events.find(event => event.date === selectedDate)?.places || [];

  const polylineColors = ['#FF0000', '#FFA500', '#FFFF00', '#008000'];

  const placeSegments =
    selectedDate === 'all'
      ? events.map(event => event.places)
      : [selectedPlaces];

  // 지도 포커싱 처리
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    if (circleVisible) {
      const circleCoords = events.map(e => e.places[0]);
      mapRef.current.fitToCoordinates(circleCoords, {
        edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
        animated: true,
      });
    } else if (selectedPlaces.length > 0) {
      mapRef.current.fitToCoordinates(selectedPlaces, {
        edgePadding: {top: 80, right: 80, bottom: 80, left: 80},
        animated: true,
      });
    }
  }, [mapReady, selectedPlaces, circleVisible]);

  const handleCircleSelect = (date: string) => {
    setSelectedDate(date);
    setCircleVisible(false);
  };

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderBar
        title={selectedDate === 'all' ? '전체 일정' : selectedDate || '지도'}
        onMenuPress={() => setSideVisible(true)}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          onMapReady={() => setMapReady(true)}
          showsUserLocation
          zoomEnabled
          zoomControlEnabled
          initialRegion={{
            latitude: allPlaces[0].latitude,
            longitude: allPlaces[0].longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>
          {(circleVisible || selectedDate === 'all') &&
            events.map(event => {
              const firstPlace = event.places[0];
              return (
                <React.Fragment key={event.date}>
                  <Circle
                    center={{
                      latitude: firstPlace.latitude,
                      longitude: firstPlace.longitude,
                    }}
                    radius={6000}
                    strokeColor="rgba(0,0,255,0.5)"
                    fillColor="rgba(0,0,255,0.2)"
                  />
                  <Marker
                    coordinate={{
                      latitude: firstPlace.latitude,
                      longitude: firstPlace.longitude,
                    }}
                    onPress={() => handleCircleSelect(event.date)}
                    anchor={{x: 0.5, y: 0.5}}
                    tracksViewChanges={true}>
                    <Text style={styles.circleText}>{event.date}</Text>
                  </Marker>
                </React.Fragment>
              );
            })}
          {selectedDate !== 'all' && selectedPlaces.length > 0 && (
            <Polyline
              coordinates={selectedPlaces}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
          {selectedDate !== 'all' &&
            selectedPlaces.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}>
                <View style={styles.customMarker}>
                  <Text style={styles.markerText}>{index + 1}</Text>
                </View>
              </Marker>
            ))}
        </MapView>
      </View>
      <SideSheet
        visible={sideVisible}
        onClose={() => setSideVisible(false)}
        events={events}
        onSelectDate={date => {
          setSelectedDate(date);
          setCircleVisible(date === 'all'); // 'all' 선택 시 원형 표시
        }}
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
  circleMarker: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    width: 'auto',
    height: 35,
    minWidth: 60,
    maxWidth: 120,
  },
  circleText: {
    fontWeight: 'bold',
    color: 'blue',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
});

export default MapScreen;
