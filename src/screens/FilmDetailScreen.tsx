import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LikeButton from '../components/LikeButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import ImageViewerModal from '../modals/ImageViewerModal';
import Icon from 'react-native-vector-icons/Ionicons';
import {getFilmData} from '../api/api';

type Props = NativeStackScreenProps<RootStackParamList, 'FilmDetail'>;

interface Cast {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

interface FImage {
  filePath: string;
  aspectRatio: number;
  width: number;
  height: number;
  type: string;
}

interface Film {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  director: string;
  overview: string;
  cast: Cast[];
  images: FImage[];
  isLiked: boolean;
  likesCount: number;
  filmingCountries: string[];
}

const FilmDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {filmId} = route.params;

  const [film, setFilm] = useState<Film | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [modalImages, setModalImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const toggleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => prev + (liked ? -1 : 1));
  };

  const openPosterModal = () => {
    if (!film) return;
    setModalImages([`https://image.tmdb.org/t/p/w500${film.posterPath}`]);
    setSelectedImageIndex(0);
    setIsImageModalVisible(true);
  };

  const openImageModal = (index: number) => {
    if (!film) return;
    const imagePaths = film.images.map(
      img => `https://image.tmdb.org/t/p/w500${img.filePath}`,
    );
    setModalImages(imagePaths);
    setSelectedImageIndex(index);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageIndex(0);
    setModalImages([]);
  };

  const handleCreateTravelPlan = () => {
    if (!film) return; // film이 null이면 아무 동작도 하지 않음

    navigation.navigate('Country', {
      movieId: filmId,
      countries: film.filmingCountries,
    });

    console.log('여행 경로 만들기');
  };

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const data = await getFilmData(filmId);
        setFilm(data);
        setLiked(data.isLiked);
        setLikeCount(data.likesCount);
      } catch (err) {
        console.error('Error fetching movie details', err);
      }
    };

    fetchMovieDetail();
  }, [filmId]);

  if (!film) {
    return (
      <View style={styles.screen}>
        <Text style={{textAlign: 'center', marginTop: 20}}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{film.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={openPosterModal}>
          <Image
            source={{uri: `https://image.tmdb.org/t/p/w500${film.posterPath}`}}
            style={styles.poster}
          />
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

        <Text style={styles.imagesTitle}>스틸컷</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {film.images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(index)}>
              <Image
                source={{uri: `https://image.tmdb.org/t/p/w500${img.filePath}`}}
                style={styles.imageThumbnail}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.travelButton,
            !film && {backgroundColor: '#ccc'}, // 비활성화 스타일
          ]}
          onPress={handleCreateTravelPlan}
          disabled={!film} // film이 없으면 비활성화
        >
          <Text style={styles.travelButtonText}>여행 경로 만들기</Text>
        </TouchableOpacity>
      </ScrollView>

      <ImageViewerModal
        visible={isImageModalVisible}
        imageUris={modalImages}
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
    height: 350,
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
