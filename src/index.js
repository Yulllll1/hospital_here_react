import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Register from './pages/user/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import ChatPage from './pages/chat/ChatPage';
import ChatListPage from './pages/chat/ChatListPage';
import NewChatPage from './pages/chat/NewChatPage';
import HospitalList from './pages/Hospital/HospitalList';
import MapComponent from './pages/Hospital/MapComponent';
import HospitalResult from './pages/Hospital/HospitalResult';
import SocialLoginSuccess from './pages/SocialLoginSuccess';
import MyPage from './pages/user/MyPage';
import AdminPage from './pages/admin/AdminPage';
import SymptomAsk from './pages/SymptomAsk';
import HospitalReservation from './pages/Hospital/HospitalReservation.jsx';
import UserList from './pages/admin/UserList';
import AdminUserListDetail from './pages/admin/AdminUserListDetail';
import AdminChatList from './pages/admin/AdminChatList';
import MyActivity from './pages/user/MyActivity';
import BoardListPage from './pages/board/BoardListPage';
import CreateBoardPage from './pages/board/CreateBoardPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import CreatePostPage from './pages/board/CreatePostPage';
import PostDetailPage from './pages/board/PostDetailPage';
import UpdateBoardPage from './pages/board/UpdateBoardPage';
import UpdatePostPage from './pages/board/UpdatePostPage';
import MyReviews from './pages/user/MyReivews';
import { AdminCreateDoctorProfile } from './pages/admin/AdminCreateDoctorProfile';
import BookmarksPage from './pages/user/BookmarksPage';
import LocationPage from './pages/LocationPage.jsx';
import OtherLocationPage from './pages/OtherLocationPage.jsx';
import { LocationProvider } from './LocationContext.jsx';
import PrivateRoute from './pages/PrivateRoute.jsx';
import SymptomAskSecond from './pages/SymptomAskSecond.jsx';
import RequestEmailVerification from './pages/user/RequestEmailVerification';
import FindEmail from './pages/user/FindEmail';
import ShowEmail from './components/ShowEmail';

import ReservationSuccess from './pages/Hospital/ReservationSuccess'
import ReservationList from './pages/user/ReservationList';
import { MyPosts } from './pages/user/MyPosts.jsx';
import UserInfoPage from './pages/user/UserInfoPage';


const queryClient = new QueryClient();

const router = createBrowserRouter([
  // 로그인 필요없는 페이지 - 시작
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/social-login-success',
    element: <SocialLoginSuccess />
  },

  {
    path: '/email-verified',
    element: <RequestEmailVerification />
  },
  {
    path: '/find-email',
    element: <FindEmail />
  },
  {
    path: '/show-email',
    element: <ShowEmail />
  },
  { path: 'hospitals/maps/:hospitalid/reservation/success', element: <ReservationSuccess /> },
  {
    path: '/reservations',
    element: <ReservationList />
  },
  {
    path: 'my-posts',
    element: <MyPosts />
  },
  // 로그인 필요없는 페이지 - 끝
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <MainPage />
      },
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          // 로그인이 필요한 페이지 - 시작
          { path: 'symptoms', element: <SymptomAsk /> },
          { path: 'symptoms/diagnosis', element: <SymptomAskSecond /> },
          { path: 'location', element: <LocationPage /> },

          { path: 'location/other', element: <OtherLocationPage />},
          
          { path: 'chat/:chatRoomId/messages', element: <ChatPage /> },
          { path: 'chat/new', element: <NewChatPage /> },
          { path: 'chatlist', element: <ChatListPage /> },

          //hospitalpage
          { path: 'hospitals', element: <HospitalList /> },
          { path: 'hospitals/maps', element: <MapComponent /> },
          { path: 'hospitals/list', element: <HospitalResult />},
          { path: 'hospitals/maps/:hospitalid/reservation', element: <HospitalReservation /> },

          { path: 'hospitals', element: <HospitalList /> },
          { path: 'hospitals/maps', element: <MapComponent /> },
          { path: 'hospitals/list', element: <HospitalResult />},


          { path: 'hospitals/maps/:hospitalid/reservation', element: <HospitalReservation /> },
          { path: 'hospitals/maps/:hospitalid/reservation/success', element: <ReservationSuccess /> },

          {
            path: 'admin-page',
            element: <AdminPage />
          },
          {
            path: 'admin-page/chat-list',
            element: <AdminChatList />
          },
          {
            path: 'admin-page/user-list',
            element: <UserList />
          },
          {
            path: 'admin-page/user-list/user-detail',
            element: <AdminUserListDetail />
          },
          {
            path: 'admin-page/user-list/user-detail/doctor-profile',
            element: <AdminCreateDoctorProfile />
          },
          {
            path: 'my-page',
            element: <MyPage />
          },
          {
            path: 'my-reviews', // 새로운 경로 추가
            element: <MyReviews />
          },
          {
            path: '/bookmarks', element: <BookmarksPage />
          },

          {
            path: 'my-activity',
            element: <MyActivity />
          },
          {
            path: '/user-info',
            element: <UserInfoPage />
          },


          //board
          { path: 'boards', element: <BoardListPage /> },
          { path: 'boards/create', element: <CreateBoardPage /> },
          { path: 'boards/:id', element: <BoardDetailPage /> },
          { path: 'posts/create/:boardId', element: <CreatePostPage /> },
          { path: 'posts/:id', element: <PostDetailPage /> },
          { path: 'boards/update/:id', element: <UpdateBoardPage /> },
          { path: 'posts/update/:id', element: <UpdatePostPage /> },
          {
            path: 'my-reviews', // 새로운 경로 추가
            element: <MyReviews />
          }
        ]
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <LocationProvider> {/* 추가 */}
        <RouterProvider router={router} />
      </LocationProvider> {/* 추가 */}
    </RecoilRoot>
  </QueryClientProvider>
);
