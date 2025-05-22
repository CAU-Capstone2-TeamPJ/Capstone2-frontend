// utils/cloudinaryUpload.ts
export const uploadImageToCloudinary = async (imageUri: string) => {
  const CLOUD_NAME = 'dnqfs0rzb';
  const UPLOAD_PRESET = 'filmvoyage';

  console.log('🖼 업로드할 로컬 이미지 URI:', imageUri);

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`,
  } as any); // RN에서 FormData type 에러 방지
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();
    console.log('✅ Cloudinary 응답:', data);

    return data.secure_url;
  } catch (err) {
    console.error('❌ Cloudinary 업로드 실패:', err);
    throw err;
  }
};
