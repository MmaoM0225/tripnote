import Taro from '@tarojs/taro';

const request = <T = any>(options: Taro.request.Option): Promise<{ data: T }> => {
  const token = Taro.getStorageSync('token');
  const headers = {
    ...options.header,
    Authorization: token ? `Bearer ${token}` : ''
  };

  return Taro.request<T>({
    ...options,
    header: headers
  });
};

export default request;
