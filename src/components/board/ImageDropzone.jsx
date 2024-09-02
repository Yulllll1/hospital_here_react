import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase'; // Firebase 설정 파일 가져오기
import { Box, Typography, CircularProgress } from '@mui/material';

const ImageDropzone = ({ onImageUploaded }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      onImageUploaded(imageUrl);
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{ border: '2px dashed grey', padding: 2, textAlign: 'center', cursor: 'pointer' }}
    >
      <input {...getInputProps()} />
      <Typography variant="h6" gutterBottom>
        Drag & Drop your image here or click to select
      </Typography>
      {uploading && <CircularProgress />}
      {previewUrl && (
        <Box sx={{ mt: 2 }}>
          <img src={previewUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>
      )}
    </Box>
  );
};

export default ImageDropzone;
