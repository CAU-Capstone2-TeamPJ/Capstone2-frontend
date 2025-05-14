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
