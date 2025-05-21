import React, {useEffect, useState} from 'react';
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
import {getLikeFilms, likeFilm} from '../api/api'; // API 함수 경로 맞게 수정

interface Film {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  likesCount: number;
  isLiked: boolean;
  // 필요한 경우 다른 필드도 추가
}

const LikeListScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [films, setFilms] = useState<Film[]>([]);
  const [sortOption, setSortOption] = useState<'alpha' | 'likes'>('alpha');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedFilms = async () => {
      try {
        const data = await getLikeFilms();
        setFilms(data);
      } catch (err) {
        console.error('좋아요 영화 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedFilms();
  }, []);

  const sortedFilms = [...films].sort((a, b) => {
    if (sortOption === 'alpha') {
      return a.title.localeCompare(b.title);
    } else {
      return b.likesCount - a.likesCount;
    }
  });

  const handlePress = (film: Film) => {
    navigation.navigate('FilmDetail', {filmId: film.id});
  };

  const handleToggleLike = async (filmId: number) => {
    try {
      await likeFilm(filmId);
      const updated = await getLikeFilms(); // 최신 목록으로 갱신
      setFilms(updated);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => setSortOption('alpha')}>
          <Text
            style={[
              styles.sortText,
              sortOption === 'alpha' && styles.selectedSort,
            ]}>
            가나다 순
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOption('likes')}>
          <Text
            style={[
              styles.sortText,
              sortOption === 'likes' && styles.selectedSort,
            ]}>
            좋아요 순
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{marginTop: 40}}
        />
      ) : films.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>좋아요한 작품이 없습니다</Text>
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
              onPress={() => handlePress(item)}
              onToggleLike={() => handleToggleLike(item.id)} // 추후 기능 구현
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  sortText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 16,
  },
  selectedSort: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});

export default LikeListScreen;
