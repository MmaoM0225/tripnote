import Taro from '@tarojs/taro';
import request from '../utils/request';
import { NoteAPI } from '../../types/note';

const BASE_URL = 'http://localhost:3000/api';

// 上传图片
export const uploadImages = async (filePaths: string[]) => {
  const results: string[] = [];

  for (const path of filePaths) {
    const res = await Taro.uploadFile({
      url: `${BASE_URL}/note/upload/image`,
      filePath: path,
      name: 'images',
      header: {
        Authorization: `Bearer ${Taro.getStorageSync('token')}`,
      },
    });

    const result = JSON.parse(res.data);
    if (result.code !== 0) throw new Error(result.message || '图片上传失败');

    // 是数组
    results.push(...result.data);
  }

  return results;
};

// 上传视频
export const uploadVideo = async (filePath: string) => {
  const res = await Taro.uploadFile({
    url: `${BASE_URL}/note/upload/video`,
    filePath,
    name: 'video',
    header: {
      Authorization: `Bearer ${Taro.getStorageSync('token')}`,
    },
  });

  const result = JSON.parse(res.data);
  if (result.code !== 0) throw new Error(result.message || '视频上传失败');

  return result.data; // string url
};

// 创建游记
export const createNote = (data: NoteAPI.CreateNoteParams) => {
  return request<NoteAPI.Response<any>>({
    url: `${BASE_URL}/note/create`,
    method: 'POST',
    data,
  });
};

export const getMockNoteList = (params: { offset?: number; limit?: number }) => {
  return request<NoteAPI.Response<{ total: number; list: NoteAPI.NoteItem[] }>>({
    url: `${BASE_URL}/note/mockNote`,
    method: 'GET',
    data: params,
  });
};

export const getNoteList = (params: { offset?: number; limit?: number }) => {
  return request<NoteAPI.Response<NoteAPI.NoteItem[]>>({
    url: `${BASE_URL}/note/note`,
    method: 'GET',
    data: params,
  });
};

export const getNoteById = (id: number | string) => {
  return request<NoteAPI.Response<NoteAPI.NoteItem>>({
    url: `${BASE_URL}/note/${id}`,
    method: 'GET',
  });
};
