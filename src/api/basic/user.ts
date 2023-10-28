import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import { LoginData, LoginRes } from '@/api/basic/types/user';
import { Menu } from './types/menu';

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<Menu[]>('/api/user/menu');
}
