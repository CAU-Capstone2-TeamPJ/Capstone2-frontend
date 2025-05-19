import React, {useState} from 'react';
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
import movieData from './data/movieData.json';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import ImageViewerModal from '../modals/ImageViewerModal'; // ImageViewerModal 임포트
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 임포트

type Props = NativeStackScreenProps<RootStackParamList, 'FilmDetail'>;

const FilmDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {filmId} = route.params;
  const film = movieData.movie;

  // 예외 처리: 영화 데이터가 없을 경우
  if (!film) {
    return (
      <View style={styles.screen}>
        <Text>영화 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(film.likes);

  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => prev + (liked ? -1 : 1));

    // TODO: 서버 연결 시 좋아요 상태를 저장 또는 업데이트
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImage(null);
  };

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
        <Image source={{uri: film.poster}} style={styles.poster} />

        <Text style={styles.title}>
          {film.title} ({film.year})
        </Text>
        <Text style={styles.director}>감독: {film.director.join(', ')}</Text>
        <Text style={styles.cast}>출연진: {film.cast.join(', ')}</Text>

        <LikeButton liked={liked} likeCount={likeCount} onToggle={toggleLike} />

        <Text style={styles.synopsis}>{film.synopsis}</Text>

        {/* 스틸컷 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {film.stillCuts.map((cut, index) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(cut)}>
              <Image source={{uri: cut}} style={styles.stillCut} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* 여행 경로 만들기 버튼 */}
      <Button
        title="여행 경로 만들기"
        onPress={() =>
          navigation.navigate('Country', {
            id: film.id,
            countries: film.countries,
            distance: film.distance,
          })
        }
      />

      {/* 이미지 전체보기 모달 */}
      <ImageViewerModal
        visible={isImageModalVisible}
        imageUris={film.stillCuts}
        initialIndex={film.stillCuts.indexOf(selectedImage!)}
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
  cast: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  synopsis: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  stillCut: {
    width: 100,
    height: 100,
    marginRight: 5,
    borderRadius: 5,
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
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilmDetailScreen;
