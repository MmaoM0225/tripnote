import { useState } from 'react'
import {View, Text, Video} from '@tarojs/components'
import { chooseVideo, showToast, navigateBack, eventCenter } from '@tarojs/taro'
import { AtInput, AtTextarea, AtButton, AtIcon, AtImagePicker } from 'taro-ui'
import './index.scss'

export default function PublishPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<any[]>([]) // AtImagePicker 文件结构
  const [video, setVideo] = useState<string>('')

  // AtImagePicker 改变（添加/删除）
  const handleChangeImages = (newFiles) => {
    setFiles(newFiles)
  }

  // 选择视频
  const handleChooseVideo = async () => {
    if (video) {
      return showToast({ title: '只能上传一个视频', icon: 'none' })
    }
    const res = await chooseVideo({ sourceType: ['album', 'camera'], maxDuration: 60 })
    setVideo(res.tempFilePath)
  }
  // 校验并提交
  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || files.length === 0) {
      showToast({ title: '标题、内容和图片为必填项', icon: 'none' })
      return
    }

    // TODO：上传 files 和 video 到服务器

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
        <AtInput
          name='title'
          title='标题'
          placeholder='请输入标题'
          value={title}
          onChange={(v) => setTitle(v as string)}
          className='input'
        />
        <AtTextarea
          value={content}
          onChange={(v) => setContent(v)}
          maxLength={1000}
          placeholder='请输入内容'
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
