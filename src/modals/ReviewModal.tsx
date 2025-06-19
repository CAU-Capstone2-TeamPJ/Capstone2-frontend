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
import * as ImagePicker from 'react-native-image-picker';
import {getUserProfile, postReview, putReview} from '../api/api';
import {uploadImageToCloudinary} from '../api/utils';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'create' | 'edit';
  locationId?: number; // 작성 시 필요
  reviewId?: number; // 수정 시 필요
  initialContent?: string;
  initialRating?: number;
  initialImageUrl?: string | null;
}

const ReviewModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
  mode = 'create',
  locationId,
  reviewId,
  initialContent = '',
  initialRating = 0,
  initialImageUrl = null,
}) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      (async () => {
        const profile = await getUserProfile();
        setUsername(profile.name || '사용자');
      })();

      setContent(initialContent);
      setRating(initialRating);
      setImageUrl(initialImageUrl);
    }
  }, [visible]);

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, async response => {
      if (!response.didCancel && response.assets?.length) {
        const localUri = response.assets[0].uri;

        try {
          setIsUploading(true);
          const uploadedUrl = await uploadImageToCloudinary(localUri!);
          setImageUrl(uploadedUrl);
        } catch (err) {
          alert('이미지 업로드에 실패했습니다.');
        } finally {
          setIsUploading(false);
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
      if (mode === 'create') {
        await postReview(locationId!, content, rating, imageUrl);
      } else if (mode === 'edit' && reviewId != null) {
        await putReview(reviewId, content, rating, imageUrl);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('리뷰 처리 실패', err);
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
          <Text style={styles.title}>
            {mode === 'edit'
              ? '✏️ 댓글 수정'
              : `✍️ ${username}님, 댓글을 작성해주세요`}
          </Text>

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
              style={[
                styles.submitButton,
                isUploading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isUploading}>
              <Text style={styles.buttonText}>
                {mode === 'edit' ? '수정하기' : '댓글달기'}
              </Text>
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
    backgroundColor: '#009EFA',
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
  submitButtonDisabled: {
    backgroundColor: '#aaa',
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
