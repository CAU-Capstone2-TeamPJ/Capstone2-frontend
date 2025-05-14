import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LocationList from '../components/LocationList';
import LocationDetailModal from '../modals/LocationDetailModal';
import scheduleData from './data/scheduleData.json';
import {useNavigation} from '@react-navigation/native'; // ← 네비게이션 사용

const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [schedule, setSchedule] = useState(scheduleData.schedule);
  const {period} = scheduleData.header;
  const [isLiking, setIsLiking] = useState(false);

  const locationsByDay = (day: number) => {
    return schedule[day].locations;
  };

  const handleToggleLike = async (id: number) => {
    if (isLiking) return; // 이미 처리 중이면 무시
    setIsLiking(true);

    try {
      const updatedSchedule = schedule.map(day => {
        const updatedLocations = day.locations.map(location => {
          if (location.id === id) {
            return {
              ...location,
              liked: !location.liked,
              likes: location.liked ? location.likes - 1 : location.likes + 1,
            };
          }
          return location;
        });
        return {...day, locations: updatedLocations};
      });

      setSchedule(updatedSchedule);

      // 👇 실제 서버 요청이 있다면 여기에 API 호출
      // await api.post('/like-toggle', { id });
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const openModal = (location: any) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
  };

  return (
    <View style={styles.container}>
      {/* ✅ 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 일정</Text>
        <TouchableOpacity
          onPress={() => {
            /* TODO: 지도 보기 화면 이동 */
          }}>
          <Text style={styles.headerIcon}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* 탭 */}
      <View style={styles.tabs}>
        {Array.from({length: period}).map((_, index) => (
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
          onToggleLike={handleToggleLike}
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
        onToggleLike={handleToggleLike}
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
