import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface Props {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_count: number; // 변경된 likes => votes
  vote_average: number; // 추가된 voteAverage
  onPress?: () => void;
}

const MovieCard: React.FC<Props> = ({
  id,
  title,
  release_date: release_date,
  poster_path,
  vote_count,
  vote_average,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500${poster_path}`}}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.year}>{release_date}</Text>
        <Text style={styles.likes}>👍 {vote_count}</Text>
        <Text style={styles.rating}>⭐ {vote_average}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  poster: {
    width: 100,
    height: 140,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  year: {
    fontSize: 14,
    color: '#888',
  },
  likes: {
    fontSize: 14,
    color: '#555',
  },
  rating: {
    fontSize: 14,
    color: '#ffb100',
  },
});

export default MovieCard;
