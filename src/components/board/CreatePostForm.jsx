import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, CircularProgress, IconButton } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { Btn, Btntwo, TextF } from '../../components/global/CustomComponents';

function CreatePostForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
    updatePreviewUrls(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setImages(prevImages => [...prevImages, ...files]);
    updatePreviewUrls(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const updatePreviewUrls = (files) => {
    const urls = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(urls).then(results => {
      setPreviewUrls(prev => [...prev, ...results]);
    });
  };

  const uploadImages = async () => {
    const uploadPromises = images.map(async (image) => {
      const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      return getDownloadURL(imageRef);
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrls = [];
    if (images.length > 0) {
      imageUrls = await uploadImages();
    }

    onSubmit({ title, content, imageUrls });
    setLoading(false);
  };

  const handleRemoveImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', height: '80dvh' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', maxWidth: 600 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                게시글 작성
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextF
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextF
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,  // borderRadius를 제거
                  },
                  my: 2
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed grey',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  mb: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Typography>이미지를 드래그하거나 업로드 하세요.</Typography>
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleImageChange}
                />
                <Btn
                  sx={{ mt: 2 }}
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  이미지 업로드
                </Btn>
              </Box>
              {previewUrls.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {previewUrls.map((url, index) => (
                    <Box key={index} sx={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
                      <img src={url} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: 2 }} />
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleRemoveImage(index)}
                        sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Btntwo type="submit" sx={{ mt: 2, width: '100%' }}>
                Create Post
              </Btntwo>
              {loading && <CircularProgress sx={{ mt: 2 }} />}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default CreatePostForm;
