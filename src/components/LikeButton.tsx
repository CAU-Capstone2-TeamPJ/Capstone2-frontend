import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface Props {
  liked: boolean;
  likeCount: number;
  onToggle: () => void;
}

const LikeButton: React.FC<Props> = ({liked, likeCount, onToggle}) => (
  <TouchableOpacity onPress={onToggle} style={styles.likeContainer}>
    <Text style={[styles.likeIcon, liked && styles.liked]}>
      {liked ? '❤️' : '🤍'}
    </Text>
    <Text style={styles.likeText}>{likeCount.toLocaleString()}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeIcon: {
    fontSize: 24,
    marginRight: 6,
    color: '#888',
  },
  liked: {
    color: '#e91e63',
  },
  likeText: {
    fontSize: 16,
    color: '#444',
  },
});

export default LikeButton;
