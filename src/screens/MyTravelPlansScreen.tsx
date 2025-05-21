import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker'; // Picker 임포트 수정
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {getMyTravelPlans} from '../api/api'; // getMyTravelPlans 함수 호출 (API 파일에 정의되어 있다고 가정)

interface Location {
  id: number;
  locationId: number;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  visitOrder: number;
  travelTimeToNext: number;
  travelDistanceToNext: number;
  concept: string;
  recommendationKeywords: string[];
  images: string[];
}

interface TripDay {
  id: number;
  day: number;
  travelTimeMinutes: number;
  locations: Location[];
}

interface TravelPlan {
  id: number;
  name: string;
  movieId: number;
  movieTitle: string;
  country: string;
  concept: string;
  travelHours: number;
  totalDays: number;
  totalLocations: number;
  totalTravelTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  tripDays: TripDay[];
  user: {
    id: number;
    name: string;
    email: string;
    picture: string;
  };
}

type Props = NativeStackScreenProps<RootStackParamList, 'MyTravels'>;

const MyTravelPlansScreen: React.FC<Props> = () => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TravelPlan[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'alphabetical'>(
    'latest',
  );

  useEffect(() => {
    // 여행 계획 데이터를 API에서 받아옵니다.
    getMyTravelPlans().then(data => {
      setTravelPlans(data);
      setFilteredPlans(data);
    });
  }, []);

  // 필터링 및 정렬 함수
  const filterAndSortPlans = () => {
    let filtered = [...travelPlans];

    // 영화별 필터링
    if (selectedMovie) {
      filtered = filtered.filter(plan => plan.movieTitle === selectedMovie);
    }

    // 국가별 필터링
    if (selectedCountry) {
      filtered = filtered.filter(plan => plan.country === selectedCountry);
    }

    // 정렬
    if (sortOption === 'latest') {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortOption === 'alphabetical') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredPlans(filtered);
  };

  // 영화 및 국가 목록 생성 (중복 제거)
  const getUniqueMovies = () => {
    return [...new Set(travelPlans.map(plan => plan.movieTitle))];
  };

  const getUniqueCountries = () => {
    return [...new Set(travelPlans.map(plan => plan.country))];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 여행 계획</Text>

      {/* 필터 */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedMovie}
          onValueChange={itemValue => {
            setSelectedMovie(itemValue);
            filterAndSortPlans();
          }}>
          <Picker.Item label="영화 선택" value={null} />
          {getUniqueMovies().map(movie => (
            <Picker.Item key={movie} label={movie} value={movie} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedCountry}
          onValueChange={itemValue => {
            setSelectedCountry(itemValue);
            filterAndSortPlans();
          }}>
          <Picker.Item label="국가 선택" value={null} />
          {getUniqueCountries().map(country => (
            <Picker.Item key={country} label={country} value={country} />
          ))}
        </Picker>

        {/* 정렬 */}
        <View style={styles.sortContainer}>
          <Button
            title="최신순"
            onPress={() => {
              setSortOption('latest');
              filterAndSortPlans();
            }}
          />
          <Button
            title="가나다순"
            onPress={() => {
              setSortOption('alphabetical');
              filterAndSortPlans();
            }}
          />
        </View>
      </View>

      {/* 여행 계획 리스트 */}
      <FlatList
        data={filteredPlans}
        renderItem={({item}) => (
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>{item.name}</Text>
            <Text>영화: {item.movieTitle}</Text>
            <Text>국가: {item.country}</Text>
            <Text>여행 시간: {item.travelHours} 시간</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  planCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyTravelPlansScreen;
