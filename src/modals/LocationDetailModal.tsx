import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LikeButton from '../components/LikeButton';
import CommentItem from '../components/CommentItem';

interface LocationDetailModalProps {
  visible: boolean;
  location: any;
  onClose: () => void;
  onToggleLike: (id: number) => void; // ScheduleScreen과의 동기화를 위한 콜백
}

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  visible,
  location,
  onClose,
  onToggleLike,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [likeState, setLikeState] = useState({likes: 0, liked: false});

  useEffect(() => {
    if (location) {
      setComments(location.comments || []);
      setLikeState({
        likes: location.likes,
        liked: location.liked,
      });
    }
  }, [location]);

  const handleToggleLocationLike = () => {
    setLikeState(prev => ({
      liked: !prev.liked,
      likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
    }));

    // 부모에도 알려서 전체 일정에 반영
    if (location?.id) {
      onToggleLike(location.id);
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment,
      ),
    );
  };

  if (!location) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.container}>
        <Image source={{uri: location.image}} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name}>{location.name}</Text>
          <Text style={styles.address}>{location.address}</Text>

          <LikeButton
            liked={likeState.liked}
            likeCount={likeState.likes}
            onToggle={handleToggleLocationLike}
          />

          <Text style={styles.sectionTitle}>댓글</Text>
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={{
                  ...comment,
                  onToggleLike: () => handleToggleCommentLike(comment.id),
                }}
              />
            ))
          ) : (
            <Text style={styles.noComment}>아직 댓글이 없습니다.</Text>
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  noComment: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationDetailModal;
