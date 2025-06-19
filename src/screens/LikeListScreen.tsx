import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import LikedItemCard from '../components/LikedItemCard';
import {getLikeFilms, likeFilm} from '../api/api';

interface Film {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  likesCount: number;
  isLiked: boolean;
  voteAverage?: number; // 평균 평점 추가
  director?: string; // 감독 정보 추가
}

const LikeListScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [films, setFilms] = useState<Film[]>([]);
  const [sortOption, setSortOption] = useState<'alpha' | 'likes' | 'rating'>(
    'alpha',
  );
  const [loading, setLoading] = useState(true);

  const fetchLikedFilms = async () => {
    setLoading(true);
    try {
      const data = await getLikeFilms();
      setFilms(data);
    } catch (err) {
      console.error('좋아요 영화 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikedFilms();
    }, []),
  );

  const sortedFilms = [...films].sort((a, b) => {
    switch (sortOption) {
      case 'alpha':
        return a.title.localeCompare(b.title);
      case 'likes':
        return b.likesCount - a.likesCount;
      case 'rating':
        return (b.voteAverage || 0) - (a.voteAverage || 0);
      default:
        return 0;
    }
  });

  const handlePress = (film: Film) => {
    navigation.navigate('FilmDetail', {filmId: film.id});
  };

  const handleToggleLike = async (filmId: number) => {
    try {
      await likeFilm(filmId);
      const updated = await getLikeFilms();
      setFilms(updated);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  const getSortButtonStyle = (option: string) => [
    styles.sortButton,
    sortOption === option && styles.selectedSortButton,
  ];

  const getSortTextStyle = (option: string) => [
    styles.sortText,
    sortOption === option && styles.selectedSortText,
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>좋아요한 작품들</Text>
        <Text style={styles.headerSubtitle}>
          {films.length > 0 ? `총 ${films.length}개의 작품` : ''}
        </Text>
      </View>

      {/* 정렬 옵션 */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={getSortButtonStyle('alpha')}
          onPress={() => setSortOption('alpha')}>
          <Text style={getSortTextStyle('alpha')}>가나다순</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getSortButtonStyle('likes')}
          onPress={() => setSortOption('likes')}>
          <Text style={getSortTextStyle('likes')}>좋아요순</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getSortButtonStyle('rating')}
          onPress={() => setSortOption('rating')}>
          <Text style={getSortTextStyle('rating')}>평점순</Text>
        </TouchableOpacity>
      </View>

      {/* 본문 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009EFA" />
          <Text style={styles.loadingText}>좋아요한 작품을 불러오는 중...</Text>
        </View>
      ) : films.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💝</Text>
          <Text style={styles.emptyTitle}>좋아요한 작품이 없습니다</Text>
          <Text style={styles.emptyDescription}>
            마음에 드는 작품에 좋아요를 눌러보세요!
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedFilms}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <LikedItemCard
              type="movie"
              imageUri={item.posterPath}
              title={item.title}
              subtitle={item.releaseDate?.slice(0, 4)}
              likes={item.likesCount}
              liked={item.isLiked}
              voteAverage={item.voteAverage}
              director={item.director}
              onPress={() => handlePress(item)}
              onToggleLike={() => handleToggleLike(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSortButton: {
    backgroundColor: '#009EFA',
    borderColor: '#009EFA',
  },
  sortText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedSortText: {
    color: '#fff',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default LikeListScreen;
