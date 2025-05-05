import { useState } from 'react'
import { View, Text, Input, Textarea, Button, Image, Video } from '@tarojs/components'
import { chooseImage, chooseVideo, showToast, navigateBack, eventCenter } from '@tarojs/taro'
import './index.scss'

export default function PublishPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [video, setVideo] = useState<string>('')

  // 选择图片（最多9张）
  const handleChooseImages = async () => {
    const res = await chooseImage({
      count: 9 - images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    })
    setImages([...images, ...res.tempFilePaths])
  }

  // 删除图片
  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  // 选择视频
  const handleChooseVideo = async () => {
    if (video) {
      return showToast({ title: '只能上传一个视频', icon: 'none' })
    }
    const res = await chooseVideo({ sourceType: ['album', 'camera'], maxDuration: 60 })
    setVideo(res.tempFilePath)
  }

  // 提交校验与发布
  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || images.length === 0) {
      showToast({ title: '标题、内容和图片为必填项', icon: 'none' })
      return
    }

    // TODO: 上传图片、视频文件到服务器，保存数据库记录
    console.log({ title, content, images, video })

    // 假设保存成功，跳转回游记页面并刷新
    showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      eventCenter.trigger('refreshJournals') // 通知上一页刷新
      navigateBack()
    }, 1000)
  }

  return (
    <View className='publish-page'>
      <View className='form-section'>
        <Input
          className='input'
          placeholder='请输入标题'
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
        />
        <Textarea
          className='textarea'
          placeholder='请输入内容'
          value={content}
          onInput={(e) => setContent(e.detail.value)}
        />
      </View>

      <View className='media-section'>
        <Text className='label'>图片上传（最多9张）</Text>
        <View className='images'>
          {images.map((img, index) => (
            <View className='img-wrapper' key={index}>
              <Image className='image' src={img} mode='aspectFill' />
              <View className='remove-btn' onClick={() => removeImage(index)}>×</View>
            </View>
          ))}
          {images.length < 9 && (
            <View className='upload-btn' onClick={handleChooseImages}>+</View>
          )}
        </View>

        <Text className='label'>视频上传（仅1个）</Text>
        <View className='video-wrapper'>
          {video ? (
            <Video src={video} className='video' controls />
          ) : (
            <View className='upload-btn' onClick={handleChooseVideo}>上传视频</View>
          )}
        </View>
      </View>

      <Button className='submit-btn' onClick={handleSubmit}>发布</Button>
    </View>
  )
}
