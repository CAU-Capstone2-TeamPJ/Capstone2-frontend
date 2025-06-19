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
import ReviewModal from './ReviewModal';
import PlaceItem from '../components/PlaceItem';

interface LocationDetailModalProps {
  visible: boolean;
  id: number | null;
  onClose: () => void;
}

const API_KEY = 'AIzaSyD3xTB3LouXLK652qAPKYll2rhuwZEaMHo';

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
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

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

  const validNearbyKeywords = location?.nearbyKeywords?.filter(
    (kw: string) => kw?.trim() !== '',
  );

  const renderPlaceItems = (keyword: string) => {
    const placeIds = location?.nearbyPlaceIds?.[keyword]?.split(',') || [];

    const rows = [];
    for (let i = 0; i < placeIds.length; i += 2) {
      rows.push(placeIds.slice(i, i + 2));
    }

    return (
      <View style={{marginTop: 12, marginHorizontal: 10}}>
        <Text style={{fontWeight: 'bold', marginBottom: 4, fontSize: 15}}>
          {keyword}
        </Text>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
            }}>
            {row.map((placeId: string, colIndex: number) => (
              <View
                key={placeId}
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <PlaceItem
                  placeId={placeId}
                  index={colIndex}
                  onSelect={pid => {
                    setSelectedPlaceId(pid);
                    setWebViewVisible(true);
                  }}
                  apiKey={API_KEY}
                />
              </View>
            ))}
            {row.length < 2 && <View style={{flex: 1}} />}
          </View>
        ))}
      </View>
    );
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
              {location.images.map((img: string, idx: number) => (
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

            {validNearbyKeywords?.length > 0 &&
              validNearbyKeywords.every(
                (kw: string) =>
                  location.nearbyPlaceIds?.[kw] &&
                  !location.nearbyPlaceIds[kw].includes('dummy'),
              ) && (
                <>
                  <Text style={styles.sectionTitle}>📍 주변 키워드</Text>
                  {validNearbyKeywords.map((kw: string, idx: number) => (
                    <View key={idx}>{renderPlaceItems(kw)}</View>
                  ))}
                </>
              )}

            {renderReviewSection()}
            <TouchableOpacity
              style={styles.addCommentButton}
              onPress={() => setReviewModalVisible(true)}>
              <Text style={styles.addCommentButtonText}>댓글 달기</Text>
            </TouchableOpacity>

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
            style={{padding: 10, backgroundColor: '#009EFA'}}
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

      <ReviewModal
        visible={reviewModalVisible}
        locationId={id ?? undefined}
        onClose={() => setReviewModalVisible(false)}
        onSuccess={() => {
          setReviewModalVisible(false);
          getLocationReviews(id!).then(setReviews);
        }}
        mode="create"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  imageCarousel: {
    height: 250,
    marginBottom: 16,
  },
  carouselImage: {
    width: Dimensions.get('window').width,
    height: 250,
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
  commentSection: {
    marginTop: 20,
  },
  noCommentText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
  addCommentButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#28a745',
    borderRadius: 6,
    alignItems: 'center',
  },
  addCommentButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#009EFA',
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
});

export default LocationDetailModal;
