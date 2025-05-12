
declare namespace UserAPI {
    interface LoginParams {
        username: string;
        password: string;
    }

    interface UserInfo {
        id: string;
        username: string;
        nickname: string;
        role: 'user'|'admin' | 'reviewer';
    }

    interface Response<T = any> {
        code: number;
        message: string;
        data: T;
    }
}
