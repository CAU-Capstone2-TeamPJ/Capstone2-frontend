import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import LikeButton from './LikeButton'; // LikeButton 컴포넌트

interface LocationCardProps {
  location: any;
  onPress: (location: any) => void; // 클릭 시 이벤트 핸들러
  onToggleLike: (id: number) => void; // 좋아요 상태 토글 핸들러
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onPress,
  onToggleLike,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(location)}>
      <Image source={{uri: location.image}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{location.name}</Text>
        <LikeButton
          liked={location.liked} // 실제 좋아요 상태
          likeCount={location.likes}
          onToggle={() => onToggleLike(location.id)} // 장소 id를 전달하여 좋아요 상태 토글
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default LocationCard;
