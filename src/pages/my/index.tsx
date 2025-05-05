import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import {AtButton} from "taro-ui";
import "taro-ui/dist/style/components/button.scss"

export default function Index () {
  useLoad(() => {
    console.log('我的頁面Page loaded.')
  })

  return (
    <View className='index'>
      <Text>这是我的页</Text>
      <AtButton type='primary'>I need Taro UI</AtButton>
    </View>
  )
}
