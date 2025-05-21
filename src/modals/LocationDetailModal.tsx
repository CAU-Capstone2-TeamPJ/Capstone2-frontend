import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {getLocationData, getLocationReviews} from '../api/api';
import {WebView} from 'react-native-webview';
import CommentItem from '../components/CommentItem';

interface LocationDetailModalProps {
  visible: boolean;
  id: number | null;
  onClose: () => void;
}

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  visible,
  id,
  onClose,
}) => {
  const [location, setLocation] = useState<any>(null);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);

  const validNearbyKeywords = location?.nearbyKeywords?.filter(
    (kw: string) => kw?.trim() !== '',
  );

  useEffect(() => {
    if (id !== null) {
      (async () => {
        try {
          const data = await getLocationData(id);
          setLocation(data);

          setLoadingReviews(true);
          const reviewsData = await getLocationReviews(id);
          setReviews(reviewsData);
        } catch (error) {
          console.error('Error fetching location data:', error);
        } finally {
          setLoadingReviews(false);
        }
      })();
    }
  }, [id]);

  const handleKeywordPress = (keyword: string) => {
    const placeIds = location?.nearbyPlaceIds?.[keyword]?.split(',') || [];
    if (placeIds.length > 0) {
      setSelectedPlaceId(placeIds[0]);
      setWebViewVisible(true);
    }
  };

  const renderPlaceLinks = (keyword: string) => {
    const placeIds = location?.nearbyPlaceIds?.[keyword]?.split(',') || [];
    return placeIds.map((placeId: string, idx: number) => (
      <TouchableOpacity
        key={idx}
        onPress={() => {
          setSelectedPlaceId(placeId);
          setWebViewVisible(true);
        }}>
        <Text style={styles.keyword}>
          • {keyword} (장소 {idx + 1})
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderReviewSection = () => (
    <View style={styles.commentSection}>
      <Text style={styles.sectionTitle}>💬 댓글 ({reviews.length})</Text>
      {loadingReviews ? (
        <Text style={styles.text}>불러오는 중...</Text>
      ) : reviews.length === 0 ? (
        <Text style={styles.noCommentText}>아직 댓글이 없습니다.</Text>
      ) : (
        reviews.map(review => <CommentItem key={review.id} comment={review} />)
      )}
    </View>
  );

  if (!location) return null;

  return (
    <>
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <ScrollView style={styles.container}>
          {location.images?.length > 0 && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.imageCarousel}>
              {location.images?.map((img: string, idx: number) => (
                <Image
                  key={idx}
                  source={{uri: img}}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          <View style={styles.content}>
            <Text style={styles.title}>{location.name}</Text>
            <Text style={styles.subtitle}>
              {location.movieTitle} 영화 촬영지
            </Text>
            <Text style={styles.text}>📍 {location.address}</Text>
            <Text style={styles.text}>{location.description}</Text>

            <Text style={styles.sectionTitle}>⏱ 예상 방문 시간</Text>
            <Text style={styles.text}>{location.durationTime} 시간</Text>

            <Text style={styles.sectionTitle}>🏷 키워드</Text>
            {location.recommendationKeywords?.map(
              (kw: string, idx: number) =>
                kw && (
                  <Text key={idx} style={styles.keyword}>
                    • {kw}
                  </Text>
                ),
            )}

            {validNearbyKeywords?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>📍 주변 키워드</Text>
                {validNearbyKeywords.map((kw: string, idx: number) => (
                  <View key={idx}>{renderPlaceLinks(kw)}</View>
                ))}
              </>
            )}

            {renderReviewSection()}

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={() => setWebViewVisible(false)}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{padding: 10, backgroundColor: '#007AFF'}}
            onPress={() => setWebViewVisible(false)}>
            <Text style={{color: 'white', textAlign: 'center'}}>닫기</Text>
          </TouchableOpacity>

          <WebView
            source={{
              uri: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${selectedPlaceId}`,
            }}
            style={{flex: 1}}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  subImage: {
    width: '100%',
    height: 200,
    marginVertical: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
    marginBottom: 8,
  },
  keyword: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 4,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageCarousel: {
    height: 250,
    marginBottom: 16,
  },
  carouselImage: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  commentSection: {
    marginTop: 20,
  },
  noCommentText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default LocationDetailModal;
