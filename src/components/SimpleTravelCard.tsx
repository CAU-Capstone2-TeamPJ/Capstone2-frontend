import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../../App';

interface TravelPlan {
  id: number;
  name: string;
  movieTitle: string;
  totalDays: number;
  tripDays: {
    locations: {
      images: string[];
    }[];
  }[];
}

type SimpleTravelPlanCardProps = {
  plan: TravelPlan;
};

const SimpleTravelPlanCard: React.FC<SimpleTravelPlanCardProps> = ({plan}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const firstImage =
    plan.tripDays?.[0]?.locations?.[0]?.images?.[0] ||
    'https://your-default-image.com/default.jpg';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate('SavedSchedule', {planId: plan.id});
      }}>
      <Image source={{uri: firstImage}} style={styles.moviePoster} />
      <Text style={styles.planName} numberOfLines={1} ellipsizeMode="tail">
        {plan.name}
      </Text>
      <Text style={styles.totalDays} numberOfLines={1} ellipsizeMode="tail">
        {plan.movieTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    marginRight: 16,
    borderRadius: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  moviePoster: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  planName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalDays: {
    color: '#888',
    marginTop: 6,
  },
});

export default SimpleTravelPlanCard;
