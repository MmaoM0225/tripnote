import { useState, useEffect } from 'react'
import {View, Text, Image, Input, Checkbox} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './index.scss'
import logo from '../../assets/logo.png'

// 模拟异步校验
const mockCheckExist = async (type: 'username' | 'nickname', value: string) => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      if (type === 'username' && value === 'existingUser') resolve(true)
      else if (type === 'nickname' && value === '小明') resolve(true)
      else resolve(false)
    }, 500)
  })
}

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

  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (nickname) {
      setChecking(true)
      mockCheckExist('nickname', nickname).then((exists) => {
        setNicknameError(exists ? '昵称已存在' : '')
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
        mockCheckExist('username', username).then((exists) => {
          setUsernameError(exists ? '账号已存在' : '')
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
        <AtButton type='primary' disabled={!canRegister}>注册</AtButton>
      </View>
    </View>
  )
}
