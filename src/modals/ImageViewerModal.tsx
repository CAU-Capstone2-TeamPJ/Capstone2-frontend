import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 임포트

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  imageUris: string[];
  initialIndex: number;
  onClose: () => void;
}

const ImageViewerModal: React.FC<Props> = ({
  visible,
  imageUris,
  initialIndex,
  onClose,
}) => {
  const flatListRef = React.useRef<FlatList>(null);

  React.useEffect(() => {
    if (visible && flatListRef.current) {
      flatListRef.current.scrollToIndex({index: initialIndex, animated: false});
    }
  }, [visible, initialIndex]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />

        {/* 우측 상단에 닫기 버튼 추가 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>

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
        />
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
    top: 40, // 상단에서 40px 정도 떨어진 위치
    right: 20, // 우측에서 20px 정도 떨어진 위치
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
});

export default ImageViewerModal;
