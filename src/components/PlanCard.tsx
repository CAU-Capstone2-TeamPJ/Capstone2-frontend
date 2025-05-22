import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

interface Location {
  id: number;
  locationId: number;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  visitOrder: number;
  travelTimeToNext: number;
  travelDistanceToNext: number;
  concept: string;
  recommendationKeywords: string[];
  images: string[];
}

interface TripDay {
  id: number;
  day: number;
  travelTimeMinutes: number;
  locations: Location[];
}

interface TravelPlan {
  id: number;
  name: string;
  movieId: number;
  movieTitle: string;
  country: string;
  concept: string;
  travelHours: number;
  totalDays: number;
  totalLocations: number;
  totalTravelTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  tripDays: TripDay[];
  user: {
    id: number;
    name: string;
    email: string;
    picture: string;
  };
}

interface PlanCardProps {
  plan: TravelPlan;
  onPress: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({plan, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {plan.tripDays[0]?.locations[0]?.images.length > 0 ? (
          <Image
            source={{uri: plan.tripDays[0]?.locations[0]?.images[0]}}
            style={styles.image}
          />
        ) : (
          <View style={styles.noImage}>
            <Text>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.planTitle}>{plan.name}</Text>
        <Text style={styles.movieTitle}>{plan.movieTitle}</Text>
        <Text style={styles.country}>{plan.country}</Text>
        <Text style={styles.travelTime}>{plan.travelHours} 시간씩 이동</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5, // 안드로이드에서 그림자 효과
    shadowColor: '#000', // iOS 그림자 색상
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 5, // 그림자 반경
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  movieTitle: {
    fontSize: 14,
    color: '#888',
  },
  country: {
    fontSize: 12,
    color: '#777',
  },
  travelTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default PlanCard;
