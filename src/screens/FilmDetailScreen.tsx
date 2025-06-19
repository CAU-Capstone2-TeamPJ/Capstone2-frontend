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
import {getFilmData, likeFilm} from '../api/api';

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

  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const toggleLike = async () => {
    try {
      const result = await likeFilm(filmId);
      setLiked(result.isLiked);
      setLikeCount(result.likesCount);
    } catch (err) {
      console.error('좋아요 처리 중 오류 발생:', err);
    }
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
    if (!film) return;
    navigation.navigate('Country', {
      movieId: filmId,
      countries: film.filmingCountries,
    });
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
          <Icon name="arrow-back" size={24} color="#009EFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{film.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.posterContainer}>
          <Image
            source={{uri: `https://image.tmdb.org/t/p/w500${film.posterPath}`}}
            style={styles.poster}
          />
          <View style={styles.titleCard}>
            <View style={styles.titleRow}>
              <Text style={styles.movieTitle}>{film.title}</Text>
              <LikeButton
                liked={liked}
                likeCount={likeCount}
                onToggle={toggleLike}
              />
            </View>

            <Text style={styles.movieSubInfo}>
              {new Date(film.releaseDate).getFullYear()} ・ {film.director} 감독
            </Text>
          </View>
        </View>

        {/* 줄거리 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>줄거리</Text>
            <TouchableOpacity
              onPress={() => setShowFullSynopsis(prev => !prev)}>
              <Icon
                name={showFullSynopsis ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#009EFA"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={styles.synopsis}
            numberOfLines={showFullSynopsis ? undefined : 4}>
            {film.overview}
          </Text>
        </View>

        {/* 출연진 섹션 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>출연진</Text>
          {film.cast.slice(0, 4).map((actor, index) => (
            <View key={index} style={styles.castRow}>
              <Image
                source={{
                  uri:
                    `https://image.tmdb.org/t/p/w500${actor.profilePath}` ||
                    'https://via.placeholder.com/40',
                }}
                style={styles.castImage}
              />
              <Text style={styles.cast}>
                {actor.name} - {actor.character}
              </Text>
            </View>
          ))}
        </View>

        {/* 스틸컷 섹션 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>스틸컷</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {film.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openImageModal(index)}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${img.filePath}`,
                  }}
                  style={styles.imageThumbnail}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {film.filmingCountries.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>촬영 국가</Text>
            <View style={styles.countryList}>
              {film.filmingCountries.map((country, index) => (
                <View key={index} style={styles.countryBadge}>
                  <Text style={styles.countryText}>{country}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.travelButton, !film && {backgroundColor: '#ccc'}]}
          onPress={handleCreateTravelPlan}
          disabled={!film}>
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
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 20,
  },
  posterContainer: {
    marginBottom: 20,
    borderRadius: 12,
  },
  poster: {
    width: '100%',
    height: 'auto',
    aspectRatio: 2 / 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  titleCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flexShrink: 1,
    color: '#000',
  },
  movieSubInfo: {
    fontSize: 15,
    color: '#666',
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  castRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  castImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  cast: {
    fontSize: 14,
    color: '#333',
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  travelButton: {
    backgroundColor: '#009EFA',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  travelButtonText: {
    color: '#fff',
    fontSize: 17,
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
  moreButtonText: {
    color: '#009EFA',
    marginTop: 8,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  countryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  countryBadge: {
    backgroundColor: '#E5F0FF',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  countryText: {
    fontSize: 14,
    color: '#009EFA',
    fontWeight: '500',
  },
});

export default FilmDetailScreen;
