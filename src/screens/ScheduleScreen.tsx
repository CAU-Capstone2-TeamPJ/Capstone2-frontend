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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

const ScheduleScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDay, setSelectedDay] = useState(0); // 선택된 날
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 상태
  const [selectedLocation, setSelectedLocation] = useState<any>(null); // 선택된 장소

  const [schedule, setSchedule] = useState(scheduleData.dailyRoutes); // 수정된 데이터 구조에 맞춰 dailyRoutes로 변경
  const {totalDays} = scheduleData; // 총 일정일 수

  // 각 날짜에 해당하는 장소들 반환
  const locationsByDay = (day: number) => {
    return schedule[day].locations;
  };

  const openModal = (location: any) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
  };

  // 더미 데이터를 사용한 일정 생성 (fetch 예시)
  const createSchedule = async () => {
    // 아래는 실제 API 호출로 변경해야 합니다.
    try {
      // 더미 데이터로 일정을 생성
      const newSchedule = {
        ...scheduleData,
        planName: '새로운 여행 일정',
        savedPlanId: 12345, // 더미 ID
      };

      setSchedule(newSchedule.dailyRoutes);

      // TODO: 일정 생성 후 서버에 API 요청 (아래는 예시)
      /*
      const response = await fetch('https://api.example.com/createSchedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: newSchedule.planName,
          dailyRoutes: newSchedule.dailyRoutes,
        }),
      });

      if (!response.ok) {
        throw new Error('일정 생성 실패');
      }

      const data = await response.json();
      console.log('일정 생성 성공:', data);
      */
    } catch (error) {
      console.error('일정 생성 실패:', error);
    }
  };

  // 초기화 또는 더미 데이터를 사용해 화면을 로드
  useEffect(() => {
    // 더미 데이터 사용, 실제로는 서버에서 데이터를 불러오는 코드로 변경
    createSchedule();
  }, []);

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
        <TouchableOpacity
          onPress={() => {
            // 지도 보기 화면 이동
            navigation.navigate('Map');
          }}>
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
      {/*      <ScrollView style={styles.content}>
        <LocationList
          locations={locationsByDay(selectedDay)} // 선택된 날짜의 장소들
          onPress={openModal} // 장소 클릭 시 모달 열기
        />
      </ScrollView>*/}

      {/* 하단 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>일정 저장하기</Text>
      </TouchableOpacity>

      {/* 장소 상세 모달 */}
      {/*      <LocationDetailModal
        visible={isModalVisible}
        location={selectedLocation}
        onClose={closeModal}
      />*/}
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
