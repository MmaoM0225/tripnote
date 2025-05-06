import { useState } from 'react'
import {View, Text, Image, Checkbox, Input} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './index.scss'
import logo from '../../assets/logo.png'

export default function Index() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)

  const canLogin = username && password && agree

  return (
    <View className='login-page'>
      {/* Logo 区域 */}
      <View className='logo-container'>
        <Image src={logo} className='logo' />
      </View>

      {/* 输入框区域 */}
      <View className='form'>

        <View className='input-wrapper'>
          <Input
            type='number'
            placeholder='请输入账号'
            value={username}
            onInput={e => setUsername(e.detail.value)}
            className='input'
          />
        </View>

        <View className='input-wrapper'>
          <Input
            password={true}
            placeholder='密码'
            value={password}
            onInput={e => setPassword(e.detail.value)}
            className='input'
          />
        </View>

      </View>
      {/* 登录按钮 */}
      <View className='login-button'>
        <AtButton
          type='primary'
          disabled={!canLogin}
        >
          登录
        </AtButton>
      </View>


      {/* 协议勾选 */}
      <View className='checkbox-area'>
        <Checkbox checked={agree} onClick={() => setAgree(!agree)} value={''} />
        <Text className='protocol-text'>我已阅读并同意服务条例</Text>
      </View>


      {/* 其他方式 */}
      <View className='other-options'>
        <Text>手机号登录</Text>
        <Text>|</Text>
        <Text>其他方式登录</Text>
        <Text>|</Text>
        <Text>注册</Text>
        <Text>|</Text>
        <Text>更多</Text>
      </View>
    </View>
  )
}
