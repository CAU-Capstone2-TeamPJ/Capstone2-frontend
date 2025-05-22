import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FilmDetail'
>;

interface FilmCardProps {
  film: {
    id: number;
    title: string;
    posterPath: string;
    releaseDate: string;
    voteAverage: number;
    director: string;
  };
  rank: number; // 추가: 순위 정보
}

const getMedal = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `${rank}위`;
  }
};

const FilmCard: React.FC<FilmCardProps> = ({film, rank}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FilmDetail', {filmId: film.id})}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w200${film.posterPath}`}}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.rank}>{getMedal(rank)}</Text>
        <Text style={styles.title}>{film.title}</Text>
        <Text style={styles.meta}>
          🎬 {film.director} | ⭐ {film.voteAverage.toFixed(1)}
        </Text>
        <Text style={styles.date}>📅 {film.releaseDate.slice(0, 4)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    marginHorizontal: 12,
  },
  poster: {
    width: 100,
    height: 140,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#007AFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  date: {
    fontSize: 13,
    color: '#777',
  },
});

export default FilmCard;
