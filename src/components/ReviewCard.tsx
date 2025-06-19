import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageViewerModal from '../modals/ImageViewerModal';

interface Review {
  id: number;
  userName: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  rating: number;
  locationName?: string; // optional 처리
}

interface Props {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toISOString().split('T')[0];
};

const ReviewCard: React.FC<Props> = ({review, onEdit, onDelete}) => {
  const [viewerVisible, setViewerVisible] = useState(false);

  const renderStars = (count: number) => (
    <View style={styles.stars}>
      {Array.from({length: 5}).map((_, i) => (
        <Icon
          key={i}
          name={i < count ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      ))}
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.locationName ? (
          <Text style={styles.locationName}>📍 {review.locationName}</Text>
        ) : (
          <View />
        )}
        {renderStars(review.rating)}
      </View>

      <Text style={styles.content}>{review.content}</Text>

      {review.imageUrl ? (
        <TouchableOpacity onPress={() => setViewerVisible(true)}>
          <Image source={{uri: review.imageUrl}} style={styles.image} />
        </TouchableOpacity>
      ) : null}

      <Text style={styles.date}>{formatDate(review.createdAt)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>

      <ImageViewerModal
        visible={viewerVisible}
        imageUris={[review.imageUrl]}
        initialIndex={0}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  stars: {
    flexDirection: 'row',
  },
  content: {
    fontSize: 14,
    color: '#444',
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editText: {
    marginRight: 16,
    color: '#009EFA',
    fontWeight: '600',
  },
  deleteText: {
    color: 'red',
    fontWeight: '600',
  },
});

export default ReviewCard;
