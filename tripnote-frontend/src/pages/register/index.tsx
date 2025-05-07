import { useState, useEffect } from 'react'
import {View, Text, Image, Input, Checkbox} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './index.scss'
import logo from '../../assets/logo.png'

import {checkExist, register} from '../../api/user'
import Taro from "@tarojs/taro";

export default function Index() {
  const [nickname, setNickname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [nicknameError, setNicknameError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (nickname) {
      setChecking(true)
      checkExist({type:'nickname',value: nickname}).then((res) => {
        setNicknameError(res.data.data.exists ? '昵称已存在' : '')
      }).finally(() => {
        setChecking(false)
      })
    } else {
      setNicknameError('')
    }
  }, [nickname])

  useEffect(() => {
    if (username) {
      if (username.length < 8) {
        setUsernameError('账号长度需大于8位')
      } else {
        setChecking(true)
        checkExist({type:'username',value: username}).then((res) => {
          setUsernameError(res.data.data.exists ? '账号已存在' : '')
        }).finally(() => {
          setChecking(false)
        })
      }
    } else {
      setUsernameError('')
    }
  }, [username])

  useEffect(() => {
    if (password && password.length < 8) {
      setPasswordError('密码长度需大于8位')
    } else {
      setPasswordError('')
    }
  }, [password])

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmError('两次密码不一致')
    } else {
      setConfirmError('')
    }
  }, [confirmPassword, password])

  const canRegister =
    nickname &&
    username &&
    password &&
    confirmPassword &&
    !nicknameError &&
    !usernameError &&
    !passwordError &&
    !confirmError &&
    !checking &&
    agree

  const handleRegister = async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);
    try {
      const res = await register({
        nickname,
        username,
        password,
        confirmPassword
      });

      if (res.data.code === 0) {
        Taro.showToast({ title: '注册成功', icon: 'success' });
        setTimeout(() => {
          Taro.navigateTo({ url: '/pages/login/index' }); // 注册成功跳转登录页
        }, 1000);
      } else {
        Taro.showToast({ title: res.data.message || '注册失败', icon: 'none' });
      }
    } catch (err) {
      Taro.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className='register-page'>
      <View className='logo-container'>
        <Image src={logo} className='logo' />
      </View>

      <View className='form'>
        <View className='prompt-text'>---请入昵称---</View>
        <Input
          placeholder='昵称'
          value={nickname}
          onInput={(e) => setNickname(e.detail.value)}
          className='input'
        />
        {nicknameError && <Text className='error'>{nicknameError}</Text>}
        <View className='prompt-text'>---请入账号---</View>
        <Input
          placeholder='账号（大于8位）'
          value={username}
          onInput={(e) => setUsername(e.detail.value)}
          className='input'
        />
        {usernameError && <Text className='error'>{usernameError}</Text>}
        <View className='prompt-text'>---请入密码---</View>
        <Input
          password
          placeholder='密码（大于8位）'
          value={password}
          onInput={(e) => setPassword(e.detail.value)}
          className='input'
        />
        {passwordError && <Text className='error'>{passwordError}</Text>}
        <View className='prompt-text'>---请确认密码---</View>
        <Input
          password
          placeholder='确认密码'
          value={confirmPassword}
          onInput={(e) => setConfirmPassword(e.detail.value)}
          className='input'
        />
        {confirmError && <Text className='error'>{confirmError}</Text>}
      </View>

      <View className='checkbox-area'>
        <Checkbox checked={agree} onClick={() => setAgree(!agree)} value={''} />
        <Text className='protocol-text'>我已阅读并同意服务条例</Text>
      </View>

      <View className='register-button'>
        <AtButton type='primary' disabled={!canRegister} onClick={handleRegister}>注册</AtButton>
      </View>
    </View>
  )
}
