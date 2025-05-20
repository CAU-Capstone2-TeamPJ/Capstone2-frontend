import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import LikeButton from '../components/LikeButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import ImageViewerModal from '../modals/ImageViewerModal';
import Icon from 'react-native-vector-icons/Ionicons';

// 타입 정의
type Props = NativeStackScreenProps<RootStackParamList, 'FilmDetail'>;

const dummyFilmData = {
  title: '라라랜드',
  overview:
    '차들로 빽빽이 들어찬 LA의 고속도로. 거북이 걸음이던 도로가 뚫리기 시작하지만 미아 지금 손에 든 연기 오디션 대본을 놓지 못한다. 세바스찬은 경적을 누르며 미아를 노려보고는 사라진다. 악연의 시작. 이후 미아는 감미로운 피아노 선율에 이끌려 재즈바로 향하는데, 연주자가 바로 세바스찬이다.',
  poster: 'https://image.tmdb.org/t/p/w500/ad9ndytwOckyShSc0A6tx1rZRkW.jpg',
  releaseDate: '2016-12-01',
  director: '데이미언 셔젤',
  cast: [
    {name: '라이언 고슬링', character: 'Sebastian'},
    {name: '엠마 스톤', character: 'Mia'},
    {name: '존 레전드', character: 'Keith'},
  ],
  images: [
    'https://image.tmdb.org/t/p/w500/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg',
    'https://image.tmdb.org/t/p/w500/2wmDyHz4gvF6m51IQZJnJzlLsnz.jpg',
    'https://image.tmdb.org/t/p/w500/z830hvnEW6E7KyMSLRKm4HvJRhN.jpg',
  ],
  likes: 2,
  likeStatus: false,
};

const FilmDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {filmId} = route.params;

  // 더미 데이터를 사용하여 영화 정보 설정
  const [film, setFilm] = useState(dummyFilmData);

  const [liked, setLiked] = useState(film.likeStatus);
  const [likeCount, setLikeCount] = useState(film.likes);

  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const toggleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => prev + (liked ? -1 : 1));
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageIndex(0);
  };

  const handleCreateTravelPlan = () => {
    // 여행 경로 만들기 버튼 클릭 시 동작할 내용
    navigation.navigate('Country');
    {
      /*, {
      id: dummyFilmData.id,
      countries: dummyFilmData.countries,
      distance: dummyFilmData.distance,
    }*/
    }
    console.log('여행 경로 만들기');
  };

  useEffect(() => {
    // 영화 상세 정보를 서버에서 가져오는 부분 (fetch 사용 예시)
    const fetchMovieDetail = async () => {
      try {
        // 서버와 연결되면 아래처럼 fetch 요청을 보낼 수 있습니다.
        // const response = await fetch(`https://api.themoviedb.org/3/movie/${filmId}?api_key=YOUR_API_KEY`);
        // const data = await response.json();

        // 더미 데이터로 설정
        setFilm(dummyFilmData);
      } catch (err) {
        console.error('Error fetching movie details', err);
      }
    };

    fetchMovieDetail();
  }, [filmId]);

  return (
    <View style={styles.screen}>
      {/* 상단 헤더 */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{film.title}</Text>
      </View>

      {/* 영화 상세 정보 */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* 포스터 클릭 시 전체화면 이미지 모달 열기 */}
        <TouchableOpacity onPress={() => openImageModal(0)}>
          <Image source={{uri: film.poster}} style={styles.poster} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {film.title} ({new Date(film.releaseDate).getFullYear()})
        </Text>
        <Text style={styles.director}>감독 {film.director}</Text>

        <LikeButton liked={liked} likeCount={likeCount} onToggle={toggleLike} />

        <Text style={styles.synopsis}>{film.overview}</Text>

        <Text style={styles.castTitle}>출연진</Text>
        {film.cast.slice(0, 4).map((actor, index) => (
          <Text key={index} style={styles.cast}>
            {actor.name}
          </Text>
        ))}

        {/* 영화 이미지들 */}
        <Text style={styles.imagesTitle}>스틸컷</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {film.images.map((imageUri, index) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(index)}>
              <Image source={{uri: imageUri}} style={styles.imageThumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 여행 경로 만들기 버튼 */}
        <TouchableOpacity
          style={styles.travelButton}
          onPress={handleCreateTravelPlan}>
          <Text style={styles.travelButtonText}>여행 경로 만들기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 이미지 전체보기 모달 */}
      <ImageViewerModal
        visible={isImageModalVisible}
        imageUris={film.images}
        initialIndex={selectedImageIndex}
        onClose={closeImageModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  poster: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  director: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  castTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  cast: {
    fontSize: 14,
    color: '#333',
  },
  imagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  synopsis: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  travelButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  travelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilmDetailScreen;
