import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {getMyReviews, deleteReview} from '../api/api';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../modals/ReviewModal';
import {useNavigation} from '@react-navigation/native'; // 뒤로가기 기능을 위한 react-navigation 사용
import Icon from 'react-native-vector-icons/Ionicons';

interface Review {
  id: number;
  userName: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  rating: number;
  locationName: string;
}

const MyReviewScreen: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // 뒤로가기 버튼에 사용

  const fetchReviews = async () => {
    try {
      const data = await getMyReviews();
      setReviews(data);
    } catch (err) {
      console.error('리뷰 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (review: any) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  const handleDelete = async (reviewId: number) => {
    Alert.alert('삭제 확인', '리뷰를 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview(reviewId);
            fetchReviews();
          } catch (err) {
            console.error('리뷰 삭제 실패', err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 상단바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={24}
            color="#007AFF"
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>내가 작성한 리뷰</Text>
      </View>

      {/* 리뷰가 없을 때 */}
      {reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>작성한 리뷰가 없습니다.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ReviewCard
              review={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={{paddingBottom: 40}}
        />
      )}

      {/* 리뷰 수정 모달 */}
      {selectedReview && (
        <ReviewModal
          visible={modalVisible}
          mode="edit"
          reviewId={selectedReview.id}
          initialContent={selectedReview.content}
          initialRating={selectedReview.rating}
          initialImageUrl={selectedReview.imageUrl}
          onClose={() => {
            setModalVisible(false);
            setSelectedReview(null);
          }}
          onSuccess={() => {
            setModalVisible(false);
            setSelectedReview(null);
            fetchReviews();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left', // 제목 중앙 정렬
    verticalAlign: 'middle', // 제목 수직 정렬
    paddingLeft: 10, // 제목과 뒤로가기 버튼 간격 조정
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#007AFF',
  },
  noReviewsText: {
    fontSize: 24,
    color: '#999',
    textAlign: 'center',
    marginTop: 250, // 리뷰가 없을 때 텍스트 위치 중앙에 가깝게 조정
  },
});

export default MyReviewScreen;
