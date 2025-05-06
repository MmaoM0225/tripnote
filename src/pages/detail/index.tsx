import { View, Text, Image, Video, Input, Swiper, SwiperItem } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import './index.scss'

const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4' // 可改为动态获取
const imageUrls = [1, 2, 3].map(i => `https://picsum.photos/600/400?random=${i}`)

export default function DetailPage() {
  return (
    <View className='detail-page'>

      {/* 吸顶栏 */}
      <View className='sticky-header'>

        <View className='author-info'>
          <AtIcon value='chevron-left' size='24' />
          <Image className='avatar' src='https://randomuser.me/api/portraits/men/11.jpg' />
          <Text className='name'>作者名</Text>
        </View>
        <View>
        <AtButton size='small' type='primary'>关注</AtButton>
        </View>
      </View>

      {/* 主体内容 */}
      <View className='content'>
        <View className='info-box'>
          <View className='info'>
            <Text>地点</Text>
            <Text className='detail'>丽江</Text>
          </View>
          <View className='info'>
            <Text>时间</Text>
            <Text className='detail'>2025年5月</Text>
          </View>
          <View className='info'>
            <Text>花费</Text>
            <Text className='detail'>¥5000</Text>
          </View>
          <View className='info'>
            <Text>行程天数</Text>
            <Text className='detail'>8天</Text>
          </View>
        </View>

        <Swiper className='image-swiper' indicatorDots  >
          {videoUrl && (
            <SwiperItem>
              <Video
                src={videoUrl}
                className='swiper-video'
                controls
              />
            </SwiperItem>
          )}
          {imageUrls.map((url, i) => (
            <SwiperItem key={i}>
              <Image className='swiper-img' src={url} mode='aspectFill' />
            </SwiperItem>
          ))}
        </Swiper>
        <Text className='title'>一次难忘的云南之旅</Text>
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
