import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {getMyTravelPlans} from '../api/api';
import PlanCard from '../components/PlanCard';
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
  const [loading, setLoading] = useState(false);

  // 화면이 처음 마운트되었는지 확인하는 ref
  const isInitialMount = useRef(true);

  const updateFilter = (
    key: 'selectedMovie' | 'selectedCountry',
    value: string | null,
  ) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const updateSortOption = (option: 'latest' | 'alphabetical') => {
    setFilters(prev => ({...prev, sortOption: option}));
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    setFilters(prev => ({
      ...prev,
      selectedMovie: null,
      selectedCountry: null,
    }));
  };

  // 영화와 국가에 대한 고유 값들을 반환하는 함수
  const getUniqueMovies = (): string[] => {
    return [...new Set(travelPlans.map(plan => plan.movieTitle))];
  };

  const getUniqueCountries = (): string[] => {
    return [...new Set(travelPlans.map(plan => plan.country))];
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await getMyTravelPlans();
      // 최신순 정렬 적용
      const sortedData = data.sort(
        (
          a: {createdAt: string | number | Date},
          b: {createdAt: string | number | Date},
        ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setTravelPlans(sortedData);

      // 데이터가 변경되었으면 필터링 다시 적용
      filterAndSortPlans(sortedData);
    } catch (error) {
      console.error('여행 계획 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // 처음 마운트될 때만 필터 초기화
      if (isInitialMount.current) {
        resetFilters();
        isInitialMount.current = false;
      }

      // 데이터는 항상 최신으로 업데이트
      fetchPlans();
    }, []),
  );

  useEffect(() => {
    if (travelPlans.length > 0) {
      filterAndSortPlans(travelPlans);
    }
  }, [filters]);

  const filterAndSortPlans = (plans: TravelPlan[] = travelPlans) => {
    let filtered = [...plans];

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

  // 활성 필터가 있는지 확인하는 함수
  const hasActiveFilters = () => {
    return filters.selectedMovie || filters.selectedCountry;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={24}
            color="#009EFA"
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>내 여행 계획</Text>
        <View style={{width: 24}} />
      </View>

      {/* 결과 요약 */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          총 {filteredPlans.length}개의 여행 계획
          {hasActiveFilters() && (
            <Text style={styles.filterIndicator}> (필터 적용됨)</Text>
          )}
        </Text>

        {hasActiveFilters() && (
          <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>필터 초기화</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>영화</Text>
          <Picker
            selectedValue={filters.selectedMovie || 'all'}
            onValueChange={value =>
              updateFilter('selectedMovie', value === 'all' ? null : value)
            }
            style={styles.picker}>
            <Picker.Item label="전체 영화" value="all" />
            {getUniqueMovies().map((movie, index) => (
              <Picker.Item key={index} label={movie} value={movie} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>국가</Text>
          <Picker
            selectedValue={filters.selectedCountry || 'all'}
            onValueChange={value =>
              updateFilter('selectedCountry', value === 'all' ? null : value)
            }
            style={styles.picker}>
            <Picker.Item label="전체 국가" value="all" />
            {getUniqueCountries().map((country, index) => (
              <Picker.Item key={index} label={country} value={country} />
            ))}
          </Picker>
        </View>

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
        refreshing={loading}
        onRefresh={fetchPlans}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    paddingLeft: 10,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButton: {
    fontSize: 24,
    color: '#009EFA',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  filterIndicator: {
    color: '#009EFA',
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  sortButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortButtonActive: {
    backgroundColor: '#009EFA',
    borderColor: '#009EFA',
  },
  sortButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default MyTravelPlansScreen;
