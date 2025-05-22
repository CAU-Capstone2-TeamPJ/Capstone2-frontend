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
}

const LikeListScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [films, setFilms] = useState<Film[]>([]);
  const [sortOption, setSortOption] = useState<'alpha' | 'likes'>('alpha');
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
    return sortOption === 'alpha'
      ? a.title.localeCompare(b.title)
      : b.likesCount - a.likesCount;
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

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내가 좋아요한 작품들</Text>
      </View>

      {/* 정렬 옵션 */}
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

      {/* 본문 */}
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
              onToggleLike={() => handleToggleLike(item.id)}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
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
