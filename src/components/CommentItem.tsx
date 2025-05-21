import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import ImageViewerModal from '../modals/ImageViewerModal';

interface Comment {
  id: number;
  userName: string;
  content: string;
  imageUrl: string; // ✅ 단일 이미지
  createdAt: string;
  rating: number;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const CommentItem: React.FC<{comment: Comment}> = ({comment}) => {
  const [viewerVisible, setViewerVisible] = useState(false);

  const renderStars = (count: number) => {
    return '⭐'.repeat(count);
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.header}>
        <Text style={styles.nickname}>{comment.userName}</Text>
        <Text style={styles.rating}>{renderStars(comment.rating)}</Text>
      </View>

      <Text style={styles.content}>{comment.content}</Text>

      {comment.imageUrl && (
        <TouchableOpacity onPress={() => setViewerVisible(true)}>
          <Image source={{uri: comment.imageUrl}} style={styles.image} />
        </TouchableOpacity>
      )}

      <Text style={styles.time}>{formatDate(comment.createdAt)}</Text>

      <ImageViewerModal
        visible={viewerVisible}
        imageUris={[comment.imageUrl]}
        initialIndex={0}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#FFD700',
  },
  content: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default CommentItem;
