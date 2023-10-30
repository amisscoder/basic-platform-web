import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import { Menu } from './types/menu';

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<Menu[]>('/api/user/menu');
}
