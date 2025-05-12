import axios, {type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { message } from 'antd';

const BASE_URL = 'http://localhost:3000/api';

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// 请求拦截器：添加 token
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器：统一错误处理（可选）
request.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        message.error(error?.response?.data?.message || '请求失败');
        return Promise.reject(error);
    }
);

// 支持泛型的通用请求函数
const typedRequest = <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return request(config);
};

export default typedRequest;
