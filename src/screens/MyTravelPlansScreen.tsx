import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {getMyTravelPlans} from '../api/api';

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

const MyTravelPlansScreen: React.FC<Props> = ({navigation}) => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TravelPlan[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'alphabetical'>(
    'latest',
  );

  useEffect(() => {
    // 초기 데이터 불러오기
    getMyTravelPlans().then(data => {
      setTravelPlans(data);
      setFilteredPlans(data);
    });
  }, []);

  // 필터링 및 정렬을 상태 변화에 따라 자동 수행
  useEffect(() => {
    filterAndSortPlans();
  }, [selectedMovie, selectedCountry, sortOption]);

  const filterAndSortPlans = () => {
    let filtered = [...travelPlans];

    if (selectedMovie) {
      filtered = filtered.filter(plan => plan.movieTitle === selectedMovie);
    }

    if (selectedCountry) {
      filtered = filtered.filter(plan => plan.country === selectedCountry);
    }

    if (sortOption === 'latest') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredPlans(filtered);
  };

  const getUniqueMovies = () => {
    return [...new Set(travelPlans.map(plan => plan.movieTitle))];
  };

  const getUniqueCountries = () => {
    return [...new Set(travelPlans.map(plan => plan.country))];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 여행 계획</Text>

      <View style={styles.filterContainer}>
        {/* 영화 Picker */}
        <Picker
          selectedValue={selectedMovie}
          onValueChange={value =>
            setSelectedMovie(value === 'all' ? null : value)
          }>
          <Picker.Item label="전체 영화" value="all" />
          {getUniqueMovies().map(movie => (
            <Picker.Item key={movie} label={movie} value={movie} />
          ))}
        </Picker>

        {/* 국가 Picker */}
        <Picker
          selectedValue={selectedCountry}
          onValueChange={value =>
            setSelectedCountry(value === 'all' ? null : value)
          }>
          <Picker.Item label="전체 국가" value="all" />
          {getUniqueCountries().map(country => (
            <Picker.Item key={country} label={country} value={country} />
          ))}
        </Picker>

        {/* 정렬 버튼 */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOption === 'latest' && styles.sortButtonActive,
            ]}
            onPress={() => setSortOption('latest')}>
            <Text
              style={[
                styles.sortButtonText,
                sortOption === 'latest' && styles.sortButtonTextActive,
              ]}>
              최신순
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOption === 'alphabetical' && styles.sortButtonActive,
            ]}
            onPress={() => setSortOption('alphabetical')}>
            <Text
              style={[
                styles.sortButtonText,
                sortOption === 'alphabetical' && styles.sortButtonTextActive,
              ]}>
              가나다순
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 여행 계획 리스트 */}
      <FlatList
        data={filteredPlans}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.planCard}
            onPress={() =>
              navigation.navigate('SavedSchedule', {planId: item.id})
            }>
            <Text style={styles.planTitle}>{item.name}</Text>
            <Text>영화: {item.movieTitle}</Text>
            <Text>국가: {item.country}</Text>
            <Text>여행 시간: {item.travelHours} 시간</Text>
          </TouchableOpacity>
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
  sortButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    alignItems: 'center',
  },

  sortButtonActive: {
    backgroundColor: '#007AFF', // 선택된 버튼 색 (예: 녹색)
  },

  sortButtonText: {
    color: '#757575', // 기본 텍스트 색 (회색)
    fontWeight: 'bold',
  },

  sortButtonTextActive: {
    color: '#fff', // 선택된 텍스트 색
  },
});

export default MyTravelPlansScreen;
