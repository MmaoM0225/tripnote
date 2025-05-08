import request from '../utils/request';
import {UserAPI} from '../../types/user';
import Taro from "@tarojs/taro";

const BASE_URL = 'http://localhost:3000/api';

export const login = (data: UserAPI.LoginParams) => {
  return request<UserAPI.Response<{ token: string, user: UserAPI.UserInfo }>>({
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

export const getUserInfo = () => {
  return request<UserAPI.Response<UserAPI.UserInfo>>({
    url: `${BASE_URL}/user/current`,
    method: 'GET',
  });
};
export const checkExist = (data: UserAPI.CheckExistParams) => {
  return request<UserAPI.Response<{ exists: boolean }>>({
    url: `${BASE_URL}/user/check`,
    method: 'GET',
    data,
  });
};

// 修改用户头像
export const uploadAvatar = async (filePath: string) => {
  try {
    const res = await Taro.uploadFile({
      url: `${BASE_URL}/user/updateAvatar`,
      filePath,
      name: 'avatar',
      header: {
        Authorization: `Bearer ${Taro.getStorageSync('token')}`,
      },
    });

    const result = JSON.parse(res.data);

    if (result.code !== 0) {
      throw new Error(result.message || '上传失败');
    }
    console.log(result.data)
    return result.data;

  } catch (error) {
    throw error;
  }
};
