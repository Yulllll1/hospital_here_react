import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { axiosInstance } from '../../utils/axios';

const ProfileImageUpload = ({ userId, onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `profileImages/${userId}/${image.name}`);
    const metadata = {
      cacheControl: 'no-cache, no-store, must-revalidate',
    };
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.error(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          await axiosInstance.put(`/users/my-page/img`, { imageUrl: downloadURL });
          onImageUpload(downloadURL);
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>업로드</button>
      <p>업로드 진행중..: {progress}%</p>
    </div>
  );
};

export default ProfileImageUpload;
