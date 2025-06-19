import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Icon from 'react-native-vector-icons/Ionicons';
import {getTravelPlan, deleteTravelPlan} from '../api/api';
import LocationList from '../components/LocationList';
import LocationDetailModal from '../modals/LocationDetailModal';
import TravelDeleteModal from '../modals/TravelDeleteModal';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedSchedule'>;

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
  images: string[];
  recommendationKeywords: string[];
}

interface TripDays {
  id: number;
  day: number;
  travelTimeMinutes: number;
  locations: Location[];
}

const SavedScheduleScreen: React.FC<Props> = ({navigation, route}) => {
  const {planId} = route.params;

  const [schedule, setSchedule] = useState<any[]>([]);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [travelPlanName, setTravelPlanName] = useState<string>(''); // 여행 계획 이름 상태 추가

  useEffect(() => {
    const fetchSavedSchedule = async () => {
      try {
        const data = await getTravelPlan(planId);
        setSchedule(data.tripDays);
        setTotalDays(data.totalDays);
        setTravelPlanName(data.name); // 받은 data.name을 상태에 설정
      } catch (error) {
        console.error('저장된 일정 불러오기 실패:', error);
      }
    };

    fetchSavedSchedule();
  }, [planId]);

  const locationsByDay = (day: number) => {
    return schedule[day]?.locations || [];
  };

  const openModal = (location: Location) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTravelPlan(planId);
      setDeleteModalVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error('일정 삭제 실패:', error);
    }
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
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#009EFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {travelPlanName || '저장된 여행 일정'}
        </Text>
        {/* 여기서 제목을 업데이트 */}
        <TouchableOpacity onPress={() => goToMapScreen()}>
          <Icon name="map" size={24} color="#009EFA" />
        </TouchableOpacity>
      </View>

      {/* 날짜 탭 */}
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

      {/* 장소 리스트 */}
      <ScrollView style={styles.content}>
        <LocationList
          locations={locationsByDay(selectedDay)}
          onPress={openModal}
        />
      </ScrollView>

      {/* 하단 삭제 버튼 */}
      <TouchableOpacity
        style={[styles.saveButton, {backgroundColor: 'red'}]}
        onPress={() => setDeleteModalVisible(true)}>
        <Text style={styles.saveButtonText}>일정 삭제하기</Text>
      </TouchableOpacity>

      {/* 장소 상세 모달 */}
      {selectedLocation && (
        <LocationDetailModal
          visible={isModalVisible}
          id={selectedLocation.locationId}
          onClose={closeModal}
        />
      )}

      {/* 삭제 모달 */}
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
    borderBottomColor: '#009EFA',
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
    backgroundColor: '#009EFA',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SavedScheduleScreen;
