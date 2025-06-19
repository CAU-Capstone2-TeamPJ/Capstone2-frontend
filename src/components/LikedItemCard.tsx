import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import LikeButton from './LikeButton';

interface Props {
  type: 'movie' | 'location';
  imageUri: string;
  title: string;
  subtitle?: string; // 연도 또는 주소
  likes: number;
  liked: boolean;
  voteAverage?: number; // 평균 평점 추가
  director?: string; // 감독 정보 (선택적)
  onToggleLike: () => void;
  onPress?: () => void;
}

const LikedItemCard: React.FC<Props> = ({
  type,
  imageUri,
  title,
  subtitle,
  likes,
  liked,
  voteAverage,
  director,
  onToggleLike,
  onPress,
}) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#4CAF50'; // 초록색 (우수)
    if (rating >= 6) return '#FF9800'; // 주황색 (보통)
    return '#F44336'; // 빨간색 (낮음)
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: `https://image.tmdb.org/t/p/w200${imageUri}`}}
          style={styles.image}
        />
        {voteAverage && (
          <View
            style={[
              styles.ratingBadge,
              {backgroundColor: getRatingColor(voteAverage)},
            ]}>
            <Text style={styles.ratingText}>★ {voteAverage.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.likeButtonContainer}>
            <LikeButton
              liked={liked}
              likeCount={likes}
              onToggle={onToggleLike}
            />
          </View>
        </View>

        <View style={styles.metaInfo}>
          {subtitle && (
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{subtitle}</Text>
            </View>
          )}

          {director && (
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>🎬</Text>
              <Text style={styles.metaText}>{director}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginHorizontal: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 110,
    height: 160,
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 24,
    flex: 1,
    marginRight: 8,
  },
  likeButtonContainer: {
    alignItems: 'flex-end',
  },
  metaInfo: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 6,
    width: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default LikedItemCard;
