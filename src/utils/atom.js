import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'recoilSession',
  storage: window.sessionStorage
});

export const chatRoomState = atom({
  key: 'chatRoomState',
  default: { rooms: {}, selectedIndex: 0 },
  effects_UNSTABLE: [persistAtom]
});

//오류나서 추가한 코드
export const authState = atom({
  key: 'authState',
  default: { isAuthenticated: false, user: null },
  effects_UNSTABLE: [persistAtom]
});

//토큰이 로컬 스토리지에 있으면 true 없으면 false
export const userauthState = atom({
  key: 'userauthState',
  default: {
    isLoggedIn: !!localStorage.getItem('token'),
    userId: null,
    role: null
  },
  effects_UNSTABLE: [persistAtom]
});

export const stompState = atom({
  key: 'stompState',
  default: {
    sendMessage: () => {}
  },
  effects_UNSTABLE: [persistAtom]
});
