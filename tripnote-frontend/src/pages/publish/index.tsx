import { useState } from 'react'
import {View, Text, Input, Video, Textarea} from '@tarojs/components'
import { chooseVideo, showToast, navigateBack, eventCenter } from '@tarojs/taro'
import { AtButton, AtIcon, AtImagePicker } from 'taro-ui'
import './index.scss'

const seasonOptions = ['春季', '夏季', '秋季', '冬季']

export default function PublishPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<any[]>([])
  const [video, setVideo] = useState<string>('')

  const [location, setLocation] = useState('')
  const [seasonIndex, setSeasonIndex] = useState(0)
  const [cost, setCost] = useState('')
  const [days, setDays] = useState('')

  const handleChangeImages = (newFiles) => {
    setFiles(newFiles)
  }

  const handleChooseVideo = async () => {
    if (video) {
      return showToast({ title: '只能上传一个视频', icon: 'none' })
    }
    const res = await chooseVideo({ sourceType: ['album', 'camera'], maxDuration: 60 })
    setVideo(res.tempFilePath)
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || files.length === 0) {
      showToast({ title: '标题、内容和图片为必填项', icon: 'none' })
      return
    }

    // TODO：上传所有字段和媒体到服务器

    showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      eventCenter.trigger('refreshJournals')
      navigateBack()
    }, 1000)
  }

  return (
    <View className='publish-page'>
      <View className='title'>
        <AtIcon value='edit' size='30' color='#000' /> 编辑游记
      </View>

      <View className='form-section'>

        <View className='input-group'>
          <Text className='input-label'>旅游地点：</Text>
          <Input
            className='input-field'
            type='text'
            maxlength={6}
            placeholder='请输入地点'
            value={location}
            onInput={(e) => setLocation(e.detail.value)}
          />
        </View>

        <View className='input-group'>
          <Text className='input-label'>旅行季节：</Text>
          <View className='season-tags'>
            {seasonOptions.map((season, index) => (
              <View
                key={season}
                className={`season-tag ${seasonIndex === index ? 'active' : ''}`}
                onClick={() => setSeasonIndex(index)}
              >
                {season}
              </View>
            ))}
          </View>
        </View>

        <View className='input-group'>
          <Text className='input-label'>旅行花费：</Text>
          <Input
            className='input-field'
            type='digit'
            placeholder='请输入花费（元）'
            value={cost}
            onInput={(e) => setCost(e.detail.value)}
          />
        </View>

        <View className='input-group'>
          <Text className='input-label'>行程天数：</Text>
          <Input
            className='input-field'
            type='number'
            placeholder='请输入天数'
            value={days}
            onInput={(e) => setDays(e.detail.value)}
          />
        </View>

        <View className='input-group'>
          <Text className='input-label'>游记标题：</Text>
          <Input
            className='input-field'
            type='text'
            placeholder='请输入标题'
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />
        </View>

        <Textarea
          value={content}
          onInput={(e) => setContent(e.detail.value)}
          placeholder='请输入内容'
          maxlength={1000}
          className='textarea'
        />
      </View>

      <View className='media-section'>
        <Text className='label'>图片上传（最多9张）</Text>
        <AtImagePicker
          files={files}
          count={9}
          multiple
          onChange={handleChangeImages}
        />

        <Text className='label' style={{ marginTop: '16px' }}>视频上传（仅1个）</Text>
        <View className='video-wrapper'>
          {video ? (
            <View className='video-container'>
              <Video
                src={video}
                className='video'
                controls
                style={{ width: '100%', height: '200px', borderRadius: '8px' }}
              />
              <View className='video-btns'>
                <AtButton
                  size='normal'
                  type='secondary'
                  onClick={() => setVideo('')}
                >
                  删除视频
                </AtButton>
              </View>
            </View>
          ) : (
            <View className='upload-btn' onClick={handleChooseVideo}>上传视频</View>
          )}
        </View>
      </View>

      <AtButton type='primary' className='submit-btn' onClick={handleSubmit}>
        发布
      </AtButton>
    </View>
  )
}
