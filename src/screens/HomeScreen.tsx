import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getFilmRanking, getMyTravelPlans} from '../api/api';
import FilmCard from '../components/FilmCard';
import SimpleTravelPlanCard from '../components/SimpleTravelCard';

interface Film {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  likesCount: number;
  isLiked: boolean;
  voteAverage: number;
  director: string;
}

interface TravelPlan {
  id: number;
  name: string;
  movieTitle: string;
  totalDays: number;
  tripDays: {
    locations: {
      images: string[];
    }[];
  }[];
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const [filmList, setFilmList] = useState<Film[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getFilmRanking();
        setFilmList(data);
      } catch (err) {
        console.error('랭킹 가져오기 실패:', err);
      }
    };
    fetchRanking();
  }, []);

  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        const data = await getMyTravelPlans(); // 최신순 정렬 필요 시 서버에서 처리
        setTravelPlans(data);
      } catch (err) {
        console.error('여행 계획 가져오기 실패:', err);
      }
    };
    fetchTravelPlans();
  }, []);

  return (
    <View style={styles.container}>
      {/* 검색창 */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search' as never)}>
        <Icon name="search" size={20} color="#888" />
        <Text style={styles.searchText}>어떤 영화를 찾고 있나요?</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 최근 여행 계획 섹션 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>✈️ 최근 여행 계획</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyTravels' as never)}
            style={styles.moreButton}>
            <Text style={styles.moreText}>더보기</Text>
          </TouchableOpacity>
        </View>

        {/* 최근 여행 계획들 */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.travelPlansContainer}>
          {travelPlans.length === 0 ? (
            <Text style={styles.noPlansText}>최근 여행 계획이 없습니다.</Text>
          ) : (
            [...travelPlans]
              .sort((a, b) => b.id - a.id) // id 기준 내림차순 정렬
              .slice(0, 5) // 상위 5개만 추출
              .map(plan => <SimpleTravelPlanCard key={plan.id} plan={plan} />)
          )}
        </ScrollView>

        {/* 인기 영화 순위 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🔥 인기 영화 순위</Text>
        </View>
        {filmList.map((film, index) => (
          <FilmCard key={film.id} film={film} rank={index + 1} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  searchText: {
    marginLeft: 8,
    color: '#888',
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moreButton: {
    padding: 8,
  },
  moreText: {
    color: '#009EFA',
    fontSize: 16,
  },
  travelPlansContainer: {
    paddingLeft: 16,
  },
  noPlansText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
