import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import LikeButton from './LikeButton';
import ImageViewerModal from '../modals/ImageViewerModal';

interface Comment {
  id: string;
  nickname: string;
  content: string;
  images: string[];
  likes: number;
  liked: boolean;
  createdAt: string;
  onToggleLike: () => void; // 좋아요 토글 기능을 받음
}

const CommentItem: React.FC<{comment: Comment}> = ({comment}) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handleImagePress = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const renderThumbnail = ({item, index}: {item: string; index: number}) => (
    <TouchableOpacity
      onPress={() => handleImagePress(index)}
      style={styles.thumbnailContainer}>
      <Image source={{uri: item}} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.commentContainer}>
      <Text style={styles.nickname}>{comment.nickname}</Text>
      <Text style={styles.content}>{comment.content}</Text>
      {comment.images?.length > 0 && (
        <FlatList
          data={comment.images}
          renderItem={renderThumbnail}
          keyExtractor={(uri, idx) => `${comment.id}-img-${idx}`}
          horizontal
          style={styles.thumbnailList}
        />
      )}
      <View style={styles.footer}>
        <LikeButton
          liked={comment.liked}
          likeCount={comment.likes}
          onToggle={comment.onToggleLike} // 부모에서 전달받은 onToggleLike 사용
        />
        <Text style={styles.time}>{comment.createdAt}</Text>
      </View>

      <ImageViewerModal
        visible={viewerVisible}
        imageUris={comment.images}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  nickname: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  thumbnailList: {
    marginVertical: 8,
  },
  thumbnailContainer: {
    marginRight: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
});

export default CommentItem;
