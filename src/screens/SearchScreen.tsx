import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MovieCard from '../components/MovieCard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {searchFilm} from '../api/api';

// Movie 타입 정의
interface Movie {
  id: number;
  title: string;
  release_date: string; // 날짜 필드
  poster_path: string;
  vote_count: number; // 투표 수 (likes 대신)
  vote_average: number; // 평점
}

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]); // 초기값을 빈 배열로 설정

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 검색어 기준 필터링
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase()),
  );

  // 검색 아이콘 클릭 시 호출되는 함수
  const handleSearchIconClick = async () => {
    if (query) {
      const data = await searchFilm(query);
      setMovies(data);
    }
  };

  // Enter 키를 눌렀을 때 호출되는 함수
  const handleSubmitEditing = async () => {
    if (query) {
      const data = await searchFilm(query);
      setMovies(data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 검색 입력창 */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={handleSearchIconClick}>
          <Icon name="search" size={20} color="#888" style={styles.icon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="작품 제목을 검색하세요"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmitEditing} // Enter 키 입력 시 검색 요청
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
