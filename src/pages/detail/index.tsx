import { View, Text, Image, Video, Input, Swiper, SwiperItem } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import './index.scss'

export default function DetailPage() {
  return (
    <View className='detail-page'>

      {/* 吸顶栏 */}
      <View className='sticky-header'>
        <AtIcon value='chevron-left' size='24' />
        <View className='author-info'>
          <Image className='avatar' src='https://randomuser.me/api/portraits/men/11.jpg' />
          <Text className='name'>作者名</Text>
        </View>
        <AtButton size='small' type='primary'>关注</AtButton>
      </View>

      {/* 主体内容 */}
      <View className='content'>

        <Text className='title'>一次难忘的云南之旅</Text>

        <View className='info-box'>
          <Text>地点：丽江</Text>
          <Text>时间：2025年5月</Text>
          <Text>花费：¥5000</Text>
          <Text>季节：春季</Text>
        </View>

        <Swiper className='image-swiper' circular autoplay>
          {[1, 2, 3].map(i => (
            <SwiperItem key={i}>
              <Image className='swiper-img' src={`https://picsum.photos/600/400?random=${i}`} mode='aspectFill' />
            </SwiperItem>
          ))}
        </Swiper>

        <View className='video-wrapper'>
          <Video
            src='https://www.w3schools.com/html/mov_bbb.mp4'
            className='video'
            controls
          />
        </View>

        <View className='article-content'>
          <Text>
            这次旅行收获颇丰，蓝天、白云、雪山与古镇构成了梦幻的旅程……
          </Text>
        </View>
      </View>

      {/* 吸底栏 */}
      <View className='bottom-bar'>
        <Input className='input-box' placeholder='写评论...' />
        <View className='action'>
          <AtIcon value='heart' size='20' />
          <Text>88</Text>
        </View>
        <View className='action'>
          <AtIcon value='star' size='20' />
          <Text>12</Text>
        </View>
        <View className='action'>
          <AtIcon value='message' size='20' />
          <Text>24</Text>
        </View>
      </View>
    </View>
  )
}
