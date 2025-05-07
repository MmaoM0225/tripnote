import { request } from '@tarojs/taro';
import { UserAPI } from '../../types/user';

const BASE_URL = 'http://localhost:3000/api';

export const login = (data: UserAPI.LoginParams) => {
  return request<UserAPI.Response<{ token: string }>>({
    url: `${BASE_URL}/user/login`,
    method: 'POST',
    data,
  });
};

export const register = (data: UserAPI.RegisterParams) => {
  return request<UserAPI.Response<{ id: number; nickname: string }>>({
    url: `${BASE_URL}/user/register`,
    method: 'POST',
    data,
  });
};

export const checkExist = (data: UserAPI.CheckExistParams) => {
  return request<UserAPI.Response<{ exists: boolean }>>({
    url: `${BASE_URL}/user/check`,
    method: 'GET',
    data,
  });
};
