import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import { LoginReq, LoginRes } from '@/api/basic/types/auth';
import { Menu } from './types/menu';

export function captcha() {
  return axios.post('/v1/login/captcha');
}

export function login(data: LoginReq) {
  return axios.post<LoginRes>('/v1/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/v1/logout');
}

export function refreshToken() {
  return axios.post<LoginRes>('/v1/token/refresh');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<Menu[]>('/api/user/menu');
}
