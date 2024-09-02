import axios from 'axios';
import { deleteCookie } from '../utils/cookies';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await axios
          .create({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            withCredentials: true
          })
          .get('/refresh-token');
        const newToken = data.headers['authorization'];
        localStorage.setItem('token', newToken);
        axiosInstance.defaults.headers.common['Authorization'] = `${newToken}`;
        originalRequest.headers['Authorization'] = `${newToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        localStorage.removeItem('token');
        deleteCookie('refreshToken');
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export const userLogin = async (email, password) => {
  try {
    const response = await axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      withCredentials: true
    }).post('/login', { email, password });
    const token = response.headers['authorization'];
    const userId = response.data.userId;
    const role = response.data.role;

    console.log(userId, role);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', role);
    axiosInstance.defaults.headers.common['Authorization'] = `${token}`;
    return { token, userId, role };
  } catch (error) {
    throw error;
  }
};

export const fetchUserReviews = async userId => {
  try {
    const response = await axiosInstance.get(`/review/users/${userId}`);
    const reviews = response.data;
    const reviewsWithHospitalName = await Promise.all(
      reviews.map(async review => {
        const hospitalResponse = await axiosInstance.get(`/api/hospitals/${review.hospitalId}`);
        const hospitalName = hospitalResponse.data.name;
        return {
          ...review,
          hospitalName
        };
      })
    );
    return reviewsWithHospitalName;
  } catch (error) {
    console.error(error);
  }
};

export const userInformation = async token => {
  try {
    const response = await axiosInstance.get('/users/my-page', {
      headers: {
        Authorization: `${token}`
      }
    });
    const username = response.data.name;
    return username;
  } catch (error) {
    console.error(error);
  }
};

export const createChatRoom = async (chatRoomType, navigate, setChatRoom) => {
  try {
    const response = await axiosInstance.post(`/chatrooms`, {
      chatRoomType
    });
    setChatRoom(e => ({
      ...e,
      rooms: { ...e.rooms, [`ch_${response.data.id}`]: response.data }
    }));
    navigate(`/chat/${response.data.id}/messages`);
  } catch (err) {
    alert(err.response.data.message);
    navigate('/');
  }
};
