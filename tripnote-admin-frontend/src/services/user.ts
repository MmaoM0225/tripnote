import request from '../utils/request';

export const login = (data: UserAPI.LoginParams) => {
    return request<UserAPI.Response<{ token: string; user: UserAPI.UserInfo }>>({
        url: '/user/login',
        method: 'POST',
        data,
    });
};

