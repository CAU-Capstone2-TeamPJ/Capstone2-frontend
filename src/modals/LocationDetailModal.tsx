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
import {getLocationData} from '../api/api';
import {WebView} from 'react-native-webview';

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
  const [webViewVisible, setWebViewVisible] = useState(false); // 웹뷰 모달 visible 상태
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null); // 선택된 장소 ID

  const validNearbyKeywords = location?.nearbyKeywords?.filter(
    (kw: string) => kw?.trim() !== '',
  );

  useEffect(() => {
    if (id !== null) {
      (async () => {
        try {
          const data = await getLocationData(id);
          setLocation(data);
        } catch (error) {
          console.error('Error fetching location data:', error);
        }
      })();
    }
  }, [id]);

  const handleKeywordPress = (keyword: string) => {
    // 키워드에 맞는 placeId들을 가져옴
    const placeIds = location?.nearbyPlaceIds?.[keyword]?.split(',') || [];
    if (placeIds.length > 0) {
      setSelectedPlaceId(placeIds[0]); // 첫 번째 장소 ID 선택
      setWebViewVisible(true); // 웹뷰 모달 열기
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
              uri: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${selectedPlaceId}`, // URL을 이처럼 설정
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
});

export default LocationDetailModal;
