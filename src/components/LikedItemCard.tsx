import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import LikeButton from './LikeButton';

interface Props {
  type: 'movie' | 'location'; // 항목 유형
  imageUri: string;
  title: string;
  subtitle?: string; // 연도 또는 주소
  likes: number;
  liked: boolean;
  onToggleLike: () => void;
  // TODO: 좋아요 업데이트를 위해선 LikeButton에 id 전달을 해야할지도...
  onPress?: () => void;
}

const LikedItemCard: React.FC<Props> = ({
  type,
  imageUri,
  title,
  subtitle,
  likes,
  liked,
  onToggleLike,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{uri: imageUri}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <LikeButton liked={liked} likeCount={likes} onToggle={onToggleLike} />
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
  image: {
    width: 100,
    height: 140,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default LikedItemCard;
