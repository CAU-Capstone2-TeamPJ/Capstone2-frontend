import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import LikedItemCard from '../components/LikedItemCard';
import LocationDetailModal from '../modals/LocationDetailModal';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

interface LikedItem {
  id: number;
  type: 'movie' | 'location';
  title: string;
  year?: number;
  image: string;
  likes: number;
  liked: boolean;
}

const dummyLikedItems: LikedItem[] = [
  {
    id: 1,
    type: 'movie',
    title: '인셉션',
    year: 2010,
    image: 'https://example.com/inception.jpg',
    likes: 1200,
    liked: true,
  },
  {
    id: 2,
    type: 'location',
    title: '남산타워',
    image: 'https://example.com/namsan.jpg',
    likes: 400,
    liked: true,
  },
];

const LikeListScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'movie' | 'location'>(
    'movie',
  );
  const [sortOption, setSortOption] = useState<'alpha' | 'likes'>('alpha');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LikedItem | null>(
    null,
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filteredItems = dummyLikedItems
    .filter(item => item.type === selectedType)
    .sort((a, b) => {
      if (sortOption === 'alpha') {
        return a.title.localeCompare(b.title);
      } else {
        return b.likes - a.likes;
      }
    });

  const handlePress = (item: LikedItem) => {
    if (item.type === 'movie') {
      navigation.navigate('FilmDetail', {filmId: item.id});
    } else {
      setSelectedLocation(item);
      setModalVisible(true);
    }
  };

  const handleToggleLike = () => {
    // TODO: 좋아요 해제 시 처리 로직 (ex: 목록에서 제거)
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 탭 선택 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'movie' && styles.selectedTab]}
          onPress={() => setSelectedType('movie')}>
          <Text style={styles.tabText}>작품</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedType === 'location' && styles.selectedTab,
          ]}
          onPress={() => setSelectedType('location')}>
          <Text style={styles.tabText}>장소</Text>
        </TouchableOpacity>
      </View>

      {/* 정렬 옵션 */}
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => setSortOption('alpha')}>
          <Text
            style={[
              styles.sortText,
              sortOption === 'alpha' && styles.selectedSort,
            ]}>
            가나다 순
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOption('likes')}>
          <Text
            style={[
              styles.sortText,
              sortOption === 'likes' && styles.selectedSort,
            ]}>
            좋아요 순
          </Text>
        </TouchableOpacity>
      </View>

      {/* 결과 목록 */}
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={item => `${item.type}-${item.id}`}
          renderItem={({item}) => (
            <LikedItemCard
              type={item.type}
              imageUri={item.image}
              title={item.title}
              subtitle={item.year ? item.year.toString() : undefined}
              likes={item.likes}
              liked={item.liked}
              onPress={() => handlePress(item)}
              onToggleLike={handleToggleLike}
            />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            좋아요한 {selectedType === 'movie' ? '작품' : '장소'}가 없습니다.
          </Text>
        </View>
      )}

      {/* 장소 상세 모달 */}
      <LocationDetailModal
        visible={modalVisible}
        location={selectedLocation}
        onClose={() => setModalVisible(false)}
        onToggleLike={handleToggleLike}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  sortText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 16,
  },
  selectedSort: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});

export default LikeListScreen;
