import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {getUserProfile, postReview} from '../api/api';
import * as ImagePicker from 'react-native-image-picker';
import {uploadImageToCloudinary} from '../api/utils'; // 추가

interface Props {
  visible: boolean;
  locationId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewModal: React.FC<Props> = ({
  visible,
  locationId,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      (async () => {
        const profile = await getUserProfile();
        setUsername(profile.name || '사용자');
      })();
    }

    setContent('');
    setRating(0);
    setImageUrl(null);
  }, [visible]);

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, async response => {
      if (!response.didCancel && response.assets?.length) {
        const localUri = response.assets[0].uri;

        try {
          console.log('📷 로컬 이미지 선택됨:', localUri);
          const uploadedUrl = await uploadImageToCloudinary(localUri!);
          setImageUrl(uploadedUrl);
          console.log('🌐 Cloudinary 업로드 URL:', uploadedUrl);
        } catch (err) {
          alert('이미지 업로드에 실패했습니다.');
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (!content || rating === 0) {
      alert('내용과 별점을 입력해주세요.');
      return;
    }

    try {
      await postReview(locationId!, content, rating, imageUrl);
      onSuccess();
      setContent('');
      setRating(0);
      setImageUrl(null);
    } catch (err) {
      console.error('리뷰 등록 실패', err);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <Text style={styles.title}>✍️ {username}님, 댓글을 작성해주세요</Text>

          <TextInput
            placeholder="내용을 입력하세요"
            multiline
            value={content}
            onChangeText={setContent}
            style={styles.input}
          />

          <Text style={styles.label}>⭐ 별점</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(i => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Text
                  style={{
                    fontSize: 28,
                    color: i <= rating ? '#FFD700' : '#ccc',
                  }}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleImagePick}>
            <Text style={styles.imageButtonText}>이미지 선택</Text>
          </TouchableOpacity>

          {imageUrl && (
            <Image source={{uri: imageUrl}} style={styles.previewImage} />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.buttonText}>댓글달기</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    minHeight: 80,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  imageButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ReviewModal;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
