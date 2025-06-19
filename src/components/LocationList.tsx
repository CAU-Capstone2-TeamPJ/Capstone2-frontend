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
  nearbyKeywords: string[];
  nearryPlaceIds: any;
  travelTimeToNext: number; // 오타 수정됨
}

interface LocationListProps {
  locations: Location[];
  onPress: (location: any) => void;
}

const LocationList: React.FC<LocationListProps> = ({locations, onPress}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {locations.map((location, index) => (
          <View key={location.locationId} style={styles.timelineRow}>
            {/* 왼쪽 세로줄 + 도트 */}
            <View style={styles.timelineColumn}>
              {/* 도트 */}
              <View style={styles.dot} />
              {/* 세로줄: 마지막 요소는 제외 */}
              {index < locations.length - 1 && (
                <View style={styles.verticalLine} />
              )}
            </View>

            {/* 오른쪽 내용 */}
            <View style={styles.cardContent}>
              <Text style={styles.indexText}>{index + 1}번째 장소</Text>
              <LocationCard location={location} onPress={onPress} />

              {/* 다음 장소까지 소요 시간 (마지막 장소는 제외) */}
              {index < locations.length - 1 && (
                <Text style={styles.travelTimeText}>
                  다음 장소까지 {location.travelTimeToNext}분 소요
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  timelineColumn: {
    width: 24,
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#009EFA',
    zIndex: 1,
  },
  verticalLine: {
    position: 'absolute',
    top: 10,
    width: 2,
    height: '100%',
    backgroundColor: '#009EFA',
  },
  cardContent: {
    flex: 1,
    paddingLeft: 8,
  },
  indexText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009EFA',
    marginBottom: 8,
  },
  travelTimeText: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
});

export default LocationList;
