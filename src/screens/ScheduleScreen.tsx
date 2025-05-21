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
import scheduleData from './data/scheduleData.json'; // 수정된 데이터 구조
import {useNavigation} from '@react-navigation/native'; // 네비게이션 사용
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 임포트
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {createTravelPlan} from '../api/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

// ...기존 import와 선언 부분은 그대로 유지

const ScheduleScreen: React.FC<Props> = ({navigation, route}) => {
  const {movieId, country, travelHours, concepts, originLat, originLng} =
    route.params;

  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [schedule, setSchedule] = useState<any[]>([]);
  const [totalDays, setTotalDays] = useState<number>(0);

  const openModal = (location: any) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
  };

  // ✅ 서버 데이터로 일정 생성
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

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            style={styles.headerIcon}
            name="arrow-back"
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 일정</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
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
      <LocationDetailModal
        visible={isModalVisible}
        location={selectedLocation}
        onClose={closeModal}
        onToggleLike={function (id: number): void {
          throw new Error('Function not implemented.');
        }}
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
