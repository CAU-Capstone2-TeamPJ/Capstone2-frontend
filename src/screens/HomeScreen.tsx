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
import {getFilmRanking} from '../api/api';
import FilmCard from '../components/FilmCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [filmList, setFilmList] = useState<Film[]>([]);

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
        <Text style={styles.sectionTitle}>🔥 인기 영화 순위</Text>
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
    padding: 12,
    margin: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
});

export default HomeScreen;
