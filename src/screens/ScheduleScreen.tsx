import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import LocationList from '../components/LocationList';
import LocationDetailModal from '../modals/LocationDetailModal';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {
  createTravelPlan,
  deleteTravelPlan,
  patchTravelPlanTitle,
} from '../api/api';
import TravelDeleteModal from '../modals/TravelDeleteModal';
import SetTitleModal from '../modals/SetTitleModal';

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
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const [isTitleModalVisible, setIsTitleModalVisible] = useState(false);
  const [savingTitle, setSavingTitle] = useState(false);

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
        setLoading(false); // 데이터 로딩이 완료되면 loading을 false로 설정
        console.log('여행 일정:', data.savedPlanId);
        console.log('받아온 일정:', data);
      } catch (error) {
        setLoading(false); // 실패 시에도 loading을 false로 설정
        console.error('일정 생성 실패:', error);
      }
    };

    fetchSchedule();
  }, []);

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
        locationId: loc.locationId, // 상세 조회용 ID 추가
      })),
    }));

    navigation.navigate('Map', {events: formattedEvents});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>일정을 생성 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} disabled={loading}>
          <Icon
            style={styles.headerIcon}
            name="arrow-back"
            size={24}
            color={loading ? '#ccc' : '#007AFF'} // 로딩 중일 때 색상 변경
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 일정</Text>
        <TouchableOpacity onPress={() => goToMapScreen()} disabled={loading}>
          <Icon name="map" size={24} color={loading ? '#ccc' : '#007AFF'} />
        </TouchableOpacity>
      </View>

      {/* 탭 */}
      <View style={styles.tabs}>
        {Array.from({length: totalDays}).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, selectedDay === index && styles.selectedTab]}
            onPress={() => setSelectedDay(index)}
            disabled={loading}>
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
      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={() => setIsTitleModalVisible(true)}
        disabled={loading}>
        <Text
          style={[
            styles.saveButtonText,
            loading && styles.saveButtonTextDisabled,
          ]}>
          여행 저장하기
        </Text>
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

      <SetTitleModal
        visible={isTitleModalVisible}
        onClose={() => setIsTitleModalVisible(false)}
        onSave={async (title: string) => {
          if (!travelId) return;
          setSavingTitle(true);
          try {
            await patchTravelPlanTitle(travelId, title);
            setIsTitleModalVisible(false);
            navigation.reset({
              index: 0,
              routes: [{name: 'MainTabs'}],
            });
          } catch (err) {
            console.error('제목 저장 실패:', err);
          } finally {
            setSavingTitle(false);
          }
        }}
        loading={savingTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
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
  saveButtonDisabled: {
    backgroundColor: '#ccc', // 로딩 중일 때 버튼 색상 변경
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#777', // 텍스트 색상 변경
  },
});

export default ScheduleScreen;
