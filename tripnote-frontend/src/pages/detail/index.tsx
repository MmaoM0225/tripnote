import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, Video, Input, Swiper, SwiperItem } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import {deleteNoteById, getNoteById} from '../../api/note'
import './index.scss'
import {NoteAPI} from "../../../types/note";


export default function DetailPage() {
  const router = useRouter()
  const noteId = router.params.id
  const currentUser = Taro.getStorageSync('user')


  const [note, setNote] = useState<NoteAPI.NoteItem | null>(null)

  useEffect(() => {
    if (noteId) {
      getNoteById(noteId).then(res => {
        if (res.data.code === 0) {
          setNote(res.data.data)
        } else {
          Taro.showToast({ title: '游记获取失败', icon: 'none' })
        }
      })
    }
  }, [noteId])

  if (!note) return <View>加载中...</View>

  const {
    title,
    content,
    image_urls,
    video_url,
    location,
    season,
    cost,
    duration_days,
    author
  } = note

  const isOwner = note?.author?.id === currentUser?.id

  const handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/edit/index?id=${noteId}`
    })
  }

  const handleDelete = async () => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否确认？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteNoteById(noteId as string)
            Taro.showToast({ title: '删除成功', icon: 'success' })
            setTimeout(() => {
              Taro.navigateBack()
            }, 1000)
          } catch (err) {
            Taro.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
  return (
    <View className='detail-page'>

      {/* 吸顶栏 */}
      <View className='sticky-header'>
        <View className='author-info'>
          <Image className='avatar' src={author.avatar} />
          <Text className='name'>{author.nickname}</Text>
        </View>
        <View>
          {isOwner ? (
            <View className='owner-actions'>
              <AtButton size='small'  onClick={handleEdit}>编辑</AtButton>
              <AtButton size='small'  onClick={handleDelete}>删除</AtButton>
            </View>
          ) : (
            <AtButton size='small' type='primary'>关注</AtButton>
          )}
        </View>
      </View>

      {/* 主体内容 */}
      <View className='content'>
        {/* 元信息区 */}
        <View className='info-box'>
          <View className='info'>
            <Text>旅行地点</Text>
            <Text className='detail'>{location}</Text>
          </View>
          <View className='info'>
            <Text>旅行季节</Text>
            <Text className='detail'>{season}</Text>
          </View>
          <View className='info'>
            <Text>旅行花费</Text>
            <Text className='detail'>¥{cost}</Text>
          </View>
          <View className='info'>
            <Text>行程天数</Text>
            <Text className='detail'>{duration_days} 天</Text>
          </View>
        </View>

        {/* 视频 + 图片轮播 */}
        <Swiper className='image-swiper' indicatorDots>
          {video_url && (
            <SwiperItem>
              <Video src={video_url} className='swiper-video' controls />
            </SwiperItem>
          )}
          {image_urls.map((url, i) => (
            <SwiperItem key={i}>
              <Image
                className='swiper-img'
                src={url}
                mode='aspectFill'
                onClick={() => Taro.previewImage({
                  current: url, // 当前点击的图片
                  urls: image_urls // 图片列表
                })}
              />
            </SwiperItem>
          ))}
        </Swiper>

        {/* 标题 + 正文 */}
        <Text className='title'>{title}</Text>
        <View className='article-content'>
          <Text>{content}</Text>
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

