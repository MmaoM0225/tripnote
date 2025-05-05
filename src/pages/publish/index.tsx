import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import {AtButton} from "taro-ui";
import "taro-ui/dist/style/components/button.scss"

export default function Index () {
  useLoad(() => {
    console.log('發佈頁加載了Page loaded.')
  })

  return (
    <View className='publish'>
      <Text>这是发布页</Text>
      <AtButton type='primary'>I need Taro UI</AtButton>
    </View>
  )
}
