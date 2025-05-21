import React, {useRef, useEffect, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  ViewToken,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  imageUris: string[]; // 전체 이미지 URI 배열
  initialIndex: number; // 시작 인덱스
  onClose: () => void;
}

const ImageViewerModal: React.FC<Props> = ({
  visible,
  imageUris,
  initialIndex,
  onClose,
}) => {
  const flatListRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 모달 열릴 때 처음 위치로 스크롤
  useEffect(() => {
    if (visible && flatListRef.current) {
      flatListRef.current.scrollToIndex({index: initialIndex, animated: false});
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  // 현재 보이는 이미지 인덱스 추적
  const onViewRef = useRef(({viewableItems}: {viewableItems: ViewToken[]}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />

        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>

        {/* 이미지 리스트 */}
        <FlatList
          ref={flatListRef}
          data={imageUris}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, idx) => `${uri}-${idx}`}
          renderItem={({item}) => (
            <View style={styles.imageWrapper}>
              <Image
                source={{uri: item}}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />

        {/* 페이지 인디케이터 */}
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {currentIndex + 1} / {imageUris.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  imageWrapper: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: height * 0.7,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageViewerModal;
