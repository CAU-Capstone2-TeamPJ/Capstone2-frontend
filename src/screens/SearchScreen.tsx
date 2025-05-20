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

// Movie 타입 정의
interface Movie {
  id: number;
  title: string;
  release_date: string; // 날짜 필드
  poster_path: string;
  vote_count: number; // 투표 수 (likes 대신)
  vote_average: number; // 평점
}

// 더미 데이터 (영화 목록)
const dummyData: Movie[] = [
  {
    id: 496243,
    title: '기생충',
    release_date: '2019-05-30',
    poster_path: '/mSi0gskYpmf1FbXngM37s2HppXh.jpg',
    vote_count: 19038,
    vote_average: 8.5,
  },
  {
    id: 523077,
    title: '마약기생충',
    release_date: '2019-08-29',
    poster_path: '/9imivrXa2EPW1WfnIGgN7oZtyoA.jpg',
    vote_count: 319,
    vote_average: 5.4,
  },
  {
    id: 709589,
    title: '사랑하는 기생충',
    release_date: '2021-11-12',
    poster_path: '/7InrCxOgYgqpA9hUTF9xDk6jHJZ.jpg',
    vote_count: 14,
    vote_average: 6.9,
  },
  {
    id: 1043106,
    title: '기생충 Challenge 더블업 우주소녀',
    release_date: '2022-10-06',
    poster_path: '/q8Zu3HqkrpxJcmatpiBDYHT71X0.jpg',
    vote_count: 1,
    vote_average: 10,
  },
  {
    id: 48311,
    title: '패러사이트',
    release_date: '1982-03-12',
    poster_path: '/4DGPORlVIDIQvsuSDnM4uXKMjWS.jpg',
    vote_count: 75,
    vote_average: 4.8,
  },
];

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState(dummyData);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 검색어 기준 필터링
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase()),
  );

  // 서버 요청을 보낼 함수 (주석처리)
  const fetchMovies = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.example.com/search?query=${query}`,
      );
      const data = await response.json();
      setMovies(data.movies); // 서버에서 받은 영화 목록
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // 검색 아이콘 클릭 시 호출되는 함수
  const handleSearchIconClick = () => {
    if (query) {
      fetchMovies(query); // 아이콘 클릭 시 쿼리로 서버 요청
    }
  };

  // Enter 키를 눌렀을 때 호출되는 함수
  const handleSubmitEditing = () => {
    if (query) {
      fetchMovies(query); // Enter 키 입력 시 쿼리로 서버 요청
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
