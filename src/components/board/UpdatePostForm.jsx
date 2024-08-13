import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, CircularProgress, IconButton, Alert } from '@mui/material';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import DeleteIcon from '@mui/icons-material/Delete';

function UpdatePostForm({ post, onUpdate, userId }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(post.imageUrls.map(img => img.link) || []);
  const [removedImageUrls, setRemovedImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content);
    setPreviewUrls(post.imageUrls.map(img => img.link));
  }, [post]);

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
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async () => {
    const urls = await Promise.all(
      images.map(async (image) => {
        const uniqueImageName = `${Date.now()}_${image.name}`;
        const imageRef = ref(storage, `images/${uniqueImageName}`);
        try {
          const uploadTask = uploadBytesResumable(imageRef, image);
          await uploadTask;
          const url = await getDownloadURL(imageRef);
          return url;
        } catch (error) {
          return null;
        }
      })
    );
    return urls.filter(url => url !== null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (userId !== post.userId) {
      setError('You do not have permission to update this post.');
      return;
    }

    setLoading(true);
    let imageUrls = post.imageUrls.map(img => img.link).filter(url => !removedImageUrls.includes(url));
    if (images.length > 0) {
      const uploadedUrls = await uploadImages();
      imageUrls = [...imageUrls, ...uploadedUrls];
    }

    const updatedPost = { title, content, imageUrls };
    onUpdate(updatedPost);
    setLoading(false);
  };

  const handleRemoveImage = (index) => {
    const urlToRemove = previewUrls[index];
    setRemovedImageUrls(prev => [...prev, urlToRemove]);
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  if (userId !== post.userId) {
    return (
      <Container maxWidth="sm">
        <Box
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
          <Alert severity="error">자신이 작성한 게시글만 수정할 수 있습니다.</Alert>
          <Button variant="contained" color="primary" href="/" sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

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
        <Typography variant="h4" gutterBottom>Update Post</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
          Update Post
        </Button>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
      </Box>
    </Container>
  );
}

export default UpdatePostForm;
