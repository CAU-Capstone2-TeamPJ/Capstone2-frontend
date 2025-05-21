import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LocationList from '../components/LocationList'; // 수정된 LocationList 컴포넌트
import LocationDetailModal from '../modals/LocationDetailModal'; // 장소 상세 모달
import {useNavigation} from '@react-navigation/native'; // 네비게이션 사용
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 임포트
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {createTravelPlan, deleteTravelPlan} from '../api/api';
import TravelDeleteModal from '../modals/TravelDeleteModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

interface Location {
  locationId: number;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  visitOrder: number;
  travelTimeToNext: number;
  travelDistanceToNext: number;
  recommendationKeywords: string[];
  concept: string;
  images: string[];
}

const ScheduleScreen: React.FC<Props> = ({navigation, route}) => {
  const {movieId, country, travelHours, concepts, originLat, originLng} =
    route.params;

  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const [schedule, setSchedule] = useState<any[]>([]);
  const [totalDays, setTotalDays] = useState<number>(0);

  const [travelId, setTravelId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const handleBackPress = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (travelId === null) return;

    try {
      await deleteTravelPlan(travelId);
      setDeleteModalVisible(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs'}],
      });
    } catch (error) {
      console.error('여행 삭제 실패:', error);
      // 실패 시 토스트 등 알림 처리도 가능
    }
  };

  const openModal = (location: any) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await createTravelPlan(
          movieId,
          country,
          travelHours,
          concepts,
          originLat,
          originLng,
        );

        setSchedule(data.dailyRoutes);
        setTotalDays(data.totalDays);
        setTravelId(data.savedPlanId);
        console.log('여행 일정:', data.savedPlanId);
        console.log('받아온 일정:', data);
      } catch (error) {
        console.error('일정 생성 실패:', error);
      }
    };

    fetchSchedule();
  }, []);

  // 해당 일차의 장소들 반환
  const locationsByDay = (day: number) => {
    return schedule[day]?.locations || [];
  };

  const goToMapScreen = () => {
    const formattedEvents = schedule.map((day, index) => ({
      date: `${index + 1}일차`,
      places: day.locations.map((loc: Location) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        title: loc.locationName,
      })),
    }));

    navigation.navigate('Map', {events: formattedEvents});
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Icon
            style={styles.headerIcon}
            name="arrow-back"
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 일정</Text>
        <TouchableOpacity onPress={() => goToMapScreen()}>
          <Icon name="map" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* 탭 */}
      <View style={styles.tabs}>
        {Array.from({length: totalDays}).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, selectedDay === index && styles.selectedTab]}
            onPress={() => setSelectedDay(index)}>
            <Text style={styles.tabText}>{index + 1}일차</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 장소 목록 */}
      <ScrollView style={styles.content}>
        <LocationList
          locations={locationsByDay(selectedDay)}
          onPress={openModal}
        />
      </ScrollView>

      {/* 하단 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>일정 저장하기</Text>
      </TouchableOpacity>

      {/* 장소 상세 모달 */}
      {selectedLocation && (
        <LocationDetailModal
          visible={isModalVisible}
          id={selectedLocation.locationId}
          onClose={closeModal}
        />
      )}

      <TravelDeleteModal
        visible={deleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  headerIcon: {
    fontSize: 22,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingVertical: 16,
    flex: 1,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  saveButton: {
    paddingVertical: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduleScreen;
