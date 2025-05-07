import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtList, AtListItem } from 'taro-ui'
import './index.scss'
import { useLoad, navigateTo } from '@tarojs/taro'

export default function MePage() {

  useLoad(() => {
    console.log('我的页面加载了')
  })
  const handleJournalClick = (status: string) => {
    switch (status) {
      case 'published':
        navigateTo({ url: '/pages/journals/published' }) // 跳转到已发布页面
        break
      case 'pending':
        navigateTo({ url: '/pages/journals/pending' }) // 跳转到待审核页面
        break
      case 'rejected':
        navigateTo({ url: '/pages/journals/rejected' }) // 跳转到未通过页面
        break
      default:
        break
    }
  }

  return (
    <View className='me-page'>

      {/* 顶部个人信息 */}
      <View className='user-info'>
        <View className='user-left'>
          <Image className='avatar' src='https://randomuser.me/api/portraits/men/11.jpg' />
          <Text className='nickname'>张三</Text>
        </View>
        <View className='user-right' onClick={() => navigateTo({ url: '/pages/login/index' })}>
          <Text className='info-btn'>个人信息</Text>
          <AtIcon value='chevron-right' size='20' color='#999' />
        </View>
      </View>

      {/* 我的游记 区域 */}
      <View className='my-journals-wrapper'>
        <View className='journals-title'>我的游记</View>
        <View className='my-journals'>
          <View className='journal-item' onClick={() => handleJournalClick('published')}>
            <AtIcon value='check-circle' size='30' color='#34C759' />
            <Text>已发布</Text>
          </View>
          <View className='journal-item' onClick={() => handleJournalClick('pending')}>
            <AtIcon value='clock' size='30' color='#FFCC00' />
            <Text>待审核</Text>
          </View>
          <View className='journal-item' onClick={() => handleJournalClick('rejected')}>
            <AtIcon value='close-circle' size='30' color='#FF3B30' />
            <Text>未通过</Text>
          </View>
        </View>
      </View>
      {/* 其他 区域 */}
      <View className='other'>
      </View>
      {/* 客服 & 设置 */}
      <AtList className='bottom-list'>
        <AtListItem title='联系客服' arrow='right' iconInfo={{ value: 'phone' }} />
        <AtListItem title='设置' arrow='right' iconInfo={{ value: 'settings' }} />
      </AtList>
    </View>
  )
}
