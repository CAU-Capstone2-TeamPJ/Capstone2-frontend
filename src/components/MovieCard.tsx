import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import LikeButton from './LikeButton';

interface Props {
  id: number;
  title: string;
  year: number;
  poster: string;
  likes: number;
  liked: boolean;
  onToggleLike: (id: number) => void;
  onPress?: () => void;
}

const MovieCard: React.FC<Props> = ({
  id,
  title,
  year,
  poster,
  likes,
  liked,
  onToggleLike,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{uri: poster}} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.year}>{year}년</Text>
        <LikeButton
          liked={liked}
          likeCount={likes}
          onToggle={() => onToggleLike(id)}
        />
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
});

export default MovieCard;
