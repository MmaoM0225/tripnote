// hooks/useAuth.ts
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import {UserAPI} from "../../types/user";


export function useAuth() {
  const [user, setUser] = useState<UserAPI.UserInfo | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loadUser = () => {
    const token = Taro.getStorageSync('token');
    const storedUser = Taro.getStorageSync('user');
    if (token && storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    loadUser(); // 初始化加载一次
  }, []);

  return { user, isLoggedIn,reloadUserInfo: loadUser }
}
