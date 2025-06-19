import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getMyReviews} from '../api/api';
import {useNavigation} from '@react-navigation/native'; // 뒤로가기 기능을 위한 react-navigation 사용
import Icon from 'react-native-vector-icons/Ionicons';
import ReviewSectionList from '../components/ReviewSectionList';

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={24}
            color="#009EFA"
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>내가 작성한 리뷰</Text>
      </View>
      <View style={{flex: 1}}>
        <ReviewSectionList />
      </View>
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
    color: '#009EFA',
  },
});

export default MyReviewScreen;
