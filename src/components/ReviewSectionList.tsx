// ReviewSectionList.tsx
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, StyleSheet, Alert} from 'react-native';
import {getMyReviews, getFilmByLocationId, deleteReview} from '../api/api';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../modals/ReviewModal';

interface Review {
  id: number;
  locationId: number;
  locationName: string;
  userName: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  rating: number;
}

interface GroupedByMovie {
  movieId: number;
  movieTitle: string;
  locations: {
    locationId: number;
    locationName: string;
    reviews: Review[];
  }[];
}

const ReviewSectionList: React.FC = () => {
  const [groupedReviews, setGroupedReviews] = useState<GroupedByMovie[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchGroupedReviews = async () => {
    try {
      const rawReviews = await getMyReviews();
      const filmCache = new Map<number, any>();

      const enrichedReviews = await Promise.all(
        rawReviews.map(async (review: {locationId: number}) => {
          if (!filmCache.has(review.locationId)) {
            const film = await getFilmByLocationId(review.locationId);
            filmCache.set(review.locationId, film);
          }
          const film = filmCache.get(review.locationId);
          return {
            ...review,
            movieId: film.movieId,
            movieTitle: film.movieTitle,
          };
        }),
      );

      const movieMap = new Map<number, GroupedByMovie>();

      for (const review of enrichedReviews) {
        const {movieId, movieTitle, locationId, locationName, ...rest} = review;

        if (!movieMap.has(movieId)) {
          movieMap.set(movieId, {
            movieId,
            movieTitle,
            locations: [],
          });
        }

        const movieGroup = movieMap.get(movieId)!;
        let locationGroup = movieGroup.locations.find(
          loc => loc.locationId === locationId,
        );

        if (!locationGroup) {
          locationGroup = {
            locationId,
            locationName,
            reviews: [],
          };
          movieGroup.locations.push(locationGroup);
        }

        locationGroup.reviews.push({
          ...rest,
          locationId,
          locationName,
        });
      }

      setGroupedReviews(Array.from(movieMap.values()));
    } catch (err) {
      console.error('리뷰 로딩 실패', err);
    }
  };

  useEffect(() => {
    fetchGroupedReviews();
  }, []);

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  const handleDelete = (reviewId: number) => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview(reviewId);
            fetchGroupedReviews();
          } catch (err) {
            console.error('리뷰 삭제 실패', err);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {groupedReviews.map(movie => (
        <View key={movie.movieId} style={styles.movieBlock}>
          <Text style={styles.movieTitle}>{movie.movieTitle}</Text>
          {movie.locations.map(loc => (
            <View key={loc.locationId} style={styles.locationBlock}>
              <Text style={styles.locationTitle}>📍 {loc.locationName}</Text>
              {loc.reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={{...review, locationName: ''}}
                  onEdit={() => handleEdit(review)}
                  onDelete={() => handleDelete(review.id)}
                />
              ))}
            </View>
          ))}
        </View>
      ))}

      {selectedReview && (
        <ReviewModal
          visible={modalVisible}
          mode="edit"
          reviewId={selectedReview.id}
          initialContent={selectedReview.content}
          initialRating={selectedReview.rating}
          initialImageUrl={selectedReview.imageUrl}
          onClose={() => {
            setModalVisible(false);
            setSelectedReview(null);
          }}
          onSuccess={() => {
            setModalVisible(false);
            setSelectedReview(null);
            fetchGroupedReviews();
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  movieBlock: {marginBottom: 24},
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#009EFA',
    marginBottom: 10,
  },
  locationBlock: {marginBottom: 16, paddingLeft: 12},
  locationTitle: {fontSize: 18, fontWeight: '600', marginBottom: 6},
});

export default ReviewSectionList;
