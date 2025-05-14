import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MovieCard from '../components/MovieCard';
import data from './data/searchData.json';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState(data.movies);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 검색어 기준 필터링
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase()),
  );

  // 좋아요 토글 핸들러
  const handleToggleLike = (id: number) => {
    const updated = movies.map(movie =>
      movie.id === id
        ? {
            ...movie,
            liked: !movie.liked,
            likes: movie.liked ? movie.likes - 1 : movie.likes + 1,
          }
        : movie,
    );
    setMovies(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 검색 입력창 */}
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="작품 제목을 검색하세요"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* 검색 결과 목록 */}
      {filteredMovies.length > 0 ? (
        <FlatList
          data={filteredMovies}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <MovieCard
              {...item}
              onToggleLike={handleToggleLike}
              onPress={() =>
                navigation.navigate('FilmDetail', {
                  filmId: item.id,
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.noResult}>
          <Text style={styles.noResultText}>검색 결과가 없습니다.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  noResult: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default SearchScreen;
