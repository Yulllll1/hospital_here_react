import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
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
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>Create Post</Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            border: '2px dashed grey',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            mb: 2,
            width: '100%',
            cursor: 'pointer',
            position: 'relative'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Typography>Drag & Drop your images here or click to select</Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Images
            <input
              type="file"
              hidden
              multiple
              onChange={handleImageChange}
            />
          </Button>
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
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Create Post
        </Button>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
      </Box>
    </Container>
  );
}

export default CreatePostForm;
