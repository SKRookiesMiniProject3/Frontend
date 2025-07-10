import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,

  setUsers: (userList) => set({ users: userList }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  //전체 목록 가져오기
  getAllUsers: () => get().users,

  //개별 사용자 조회 (id 기준)
  getUserById: (id) => get().users.find((user) => user.id === id),
}));

export default useUserStore;