export namespace UserAPI {
  export interface LoginParams {
    username: string;
    password: string;
  }

  export interface RegisterParams {
    nickname: string;
    username: string;
    password: string;
    confirmPassword: string;
  }

  export interface UserInfo {
    id: number;
    nickname: string;
    avatar?: string;
    status: number;
    permission: string;
  }

  export interface CheckExistParams {
    type: 'username' | 'nickname';
    value: string;
  }

  export interface Response<T = any> {
    code: number;
    message: string;
    status: 'success'|'false';
    data: T;
  }
}
