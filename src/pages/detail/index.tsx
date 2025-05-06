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
            人这一生，总要有一次说走就走的旅行。不是为了逃避现实，而是为了在路途中重新发现自己。在熟悉的城市里，我们总是被固定的节奏所裹挟，生活像一部早已设定好剧情的剧本，日复一日地上演着相同的情节。但当你背上行囊，踏上一条陌生的路途，心也随之开始变得轻盈和自由。山川湖海，陌生的面孔，未知的文化，会不断激发你的好奇心和探索欲。你会发现，原来世界那么大，不同的人有着截然不同的生活方式和价值观。而这一切，会让你重新审视自己曾经深信不疑的事情。旅行的意义，从来不只是看风景，更在于内心的一次次自我更新与调整。你可能在某个海边的清晨，被一缕阳光照醒，突然明白了过去一直纠结的问题其实并没有那么严重；也可能在某个深夜的青旅里，和来自五湖四海的旅人聊到天明，感受到从未体验过的温暖与连接。旅行是一次与世界的对话，更是一场与自己的对话。当你离开舒适区，才会真正听见自己内心深处的声音。你会变得更包容，也更勇敢。当你回到原来的生活，你会发现，虽然周遭的一切或许没有改变，但你，已经不再是从前的你了。
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
