import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {getMyTravelPlans} from '../api/api';
import PlanCard from '../components/PlanCard'; // PlanCard 임포트
import Icon from 'react-native-vector-icons/Ionicons';

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

interface TripDay {
  id: number;
  day: number;
  travelTimeMinutes: number;
  locations: Location[];
}

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

type Props = NativeStackScreenProps<RootStackParamList, 'MyTravels'>;

const MyTravelPlansScreen: React.FC<Props> = ({navigation}) => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TravelPlan[]>([]);
  const [filters, setFilters] = useState({
    selectedMovie: null as string | null,
    selectedCountry: null as string | null,
    sortOption: 'latest' as 'latest' | 'alphabetical',
  });

  const updateFilter = (
    key: 'selectedMovie' | 'selectedCountry',
    value: string | null,
  ) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const updateSortOption = (option: 'latest' | 'alphabetical') => {
    setFilters(prev => ({...prev, sortOption: option}));
  };

  // 필터 초기화 함수 추가
  const resetFilters = () => {
    setFilters(prev => ({
      ...prev,
      selectedMovie: null,
      selectedCountry: null,
    }));
  };

  // 영화와 국가에 대한 고유 값들을 반환하는 함수 추가
  const getUniqueMovies = (): string[] => {
    return [...new Set(travelPlans.map(plan => plan.movieTitle))];
  };

  const getUniqueCountries = (): string[] => {
    return [...new Set(travelPlans.map(plan => plan.country))];
  };

  const fetchPlans = async () => {
    try {
      const data = await getMyTravelPlans();
      setTravelPlans(data);
      setFilteredPlans(data);
    } catch (error) {
      console.error('여행 계획 불러오기 실패:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
      resetFilters(); // 필터만 초기화, 정렬은 유지
    }, []),
  );

  useEffect(() => {
    filterAndSortPlans();
  }, [filters]);

  const filterAndSortPlans = () => {
    let filtered = [...travelPlans];

    if (filters.selectedMovie) {
      filtered = filtered.filter(
        plan => plan.movieTitle === filters.selectedMovie,
      );
    }

    if (filters.selectedCountry) {
      filtered = filtered.filter(
        plan => plan.country === filters.selectedCountry,
      );
    }

    if (filters.sortOption === 'latest') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredPlans(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={24}
            color="#007AFF"
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>내 여행 계획</Text>
        <View style={{width: 24}} /> {/* 오른쪽 공간 확보용 (균형 맞춤) */}
      </View>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={filters.selectedMovie}
          onValueChange={value =>
            updateFilter('selectedMovie', value === 'all' ? null : value)
          }
          style={{backgroundColor: '#fff', color: '#000'}}>
          <Picker.Item label="전체 영화" value="all" />
          {getUniqueMovies().map((movie, index) => (
            <Picker.Item key={index} label={movie} value={movie} />
          ))}
        </Picker>

        <Picker
          selectedValue={filters.selectedCountry}
          onValueChange={value =>
            updateFilter('selectedCountry', value === 'all' ? null : value)
          }
          style={{backgroundColor: '#fff', color: '#000'}}>
          <Picker.Item label="전체 국가" value="all" />
          {getUniqueCountries().map((country, index) => (
            <Picker.Item key={index} label={country} value={country} />
          ))}
        </Picker>

        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              filters.sortOption === 'latest' && styles.sortButtonActive,
            ]}
            onPress={() => updateSortOption('latest')}>
            <Text
              style={[
                styles.sortButtonText,
                filters.sortOption === 'latest' && styles.sortButtonTextActive,
              ]}>
              최신순
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              filters.sortOption === 'alphabetical' && styles.sortButtonActive,
            ]}
            onPress={() => updateSortOption('alphabetical')}>
            <Text
              style={[
                styles.sortButtonText,
                filters.sortOption === 'alphabetical' &&
                  styles.sortButtonTextActive,
              ]}>
              가나다순
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredPlans}
        renderItem={({item}) => (
          <PlanCard
            plan={item}
            onPress={() =>
              navigation.navigate('SavedSchedule', {planId: item.id})
            }
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left', // 제목 중앙 정렬
    verticalAlign: 'middle', // 제목 수직 정렬
    paddingLeft: 10, // 제목과 뒤로가기 버튼 간격 조정
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#007AFF',
  },
  filterContainer: {marginBottom: 20},
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    color: '#757575',
    fontWeight: 'bold',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
});

export default MyTravelPlansScreen;
