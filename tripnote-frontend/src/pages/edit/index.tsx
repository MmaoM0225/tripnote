import {useEffect, useState} from 'react'
import {Text,  Video, View} from '@tarojs/components'
import Taro, {chooseVideo, navigateBack, showToast, useRouter} from '@tarojs/taro'
import {AtButton, AtIcon, AtImagePicker} from 'taro-ui'
import './index.scss'
import {getNoteById, updateNote, uploadImages, uploadVideo} from '../../api/note'
import NoteForm from "../../components/NoteForm";

const seasonOptions = ['春季', '夏季', '秋季', '冬季']

export default function EditPage() {
  const router = useRouter()
  const noteId = router.params.id
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<any[]>([])
  const [video, setVideo] = useState<string>('')

  const [location, setLocation] = useState('')
  const [seasonIndex, setSeasonIndex] = useState(0)
  const [cost, setCost] = useState('')
  const [days, setDays] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  async function cacheFile(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Taro.downloadFile({
        url,
        success(res) {
          if (res.statusCode === 200 && res.tempFilePath) {
            resolve(res.tempFilePath)  // 使用临时文件路径
          } else {
            reject('下载失败')
          }
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  // 图片选择处理
  const handleChangeImages = (newFiles) => {
    const newFileList = newFiles.map(file => ({
      ...file,
      url: file.url || file.path,
    }));
    setFiles(newFileList)
  }

  // 视频选择处理
  const handleChooseVideo = async () => {
    if (video) {
      return showToast({ title: '只能上传一个视频', icon: 'none' })
    }
    const res = await chooseVideo({ sourceType: ['album', 'camera'], maxDuration: 60 })
    // 缓存视频到本地
    const localVideoPath = await cacheFile(res.tempFilePath);
    setVideo(localVideoPath);
  }


  // 删除本地缓存的文件
  const removeLocalCache = (filePaths: string[]) => {
    const fileManager = Taro.getFileSystemManager();
    filePaths.forEach(filePath => {
      try {
        fileManager.removeSavedFile({ filePath });
      } catch (error) {
        console.error('清理缓存失败:', error);
      }
    });
  }

  // 提交更新游记
  const handleSubmit = async () => {
    if (isUploading) return;
    setIsUploading(true)

    // 校验必填项
    if (!title.trim() || !content.trim() || files.length === 0) {
      showToast({ title: '标题、内容和图片为必填项', icon: 'none' })
      setIsUploading(false)
      return
    }

    try {
      Taro.showLoading({ title: '正在保存' })

      // 1. 上传图片
      const imagePaths = files.map(f => f.url || f.path);// Taro H5/小程序适配
      console.log('imagePaths:', imagePaths)
      const image_urls = await uploadImages(imagePaths);
      console.log('image_urls:', image_urls)

      // 2. 上传视频（如果存在）
      let video_url = '';
      if (video) {
        video_url = await uploadVideo(video);
        console.log('video_url:', video_url)
      }

      // 更新游记
      await updateNote(noteId as string, {
        title,
        content,
        location,
        season: seasonOptions[seasonIndex],
        cost: cost,
        duration_days: Number(days),
        image_urls,
        video_url,
      })

      showToast({ title: '更新成功', icon: 'success' })

      // 清理本地缓存
      removeLocalCache(imagePaths); // 删除缓存的图片文件
      if (video && !video.startsWith('http')) {
        removeLocalCache([video]); // 删除缓存的视频文件
      }

      setTimeout(() => navigateBack(), 1000)
    } catch (err) {
      console.error(err)
      showToast({ title: '更新失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
      setIsUploading(false)
    }
  }

  // 获取游记数据
  useEffect(() => {
    const fetchAndCacheFiles = async () => {
      if (!noteId) return;

      const res = await getNoteById(noteId)
      if (res.data.code !== 0) {
        Taro.showToast({ title: '游记获取失败', icon: 'none' })
        return
      }

      const data = res.data.data
      setTitle(data.title)
      setContent(data.content)
      setLocation(data.location)
      setSeasonIndex(seasonOptions.indexOf(data.season))
      setCost(String(data.cost))
      setDays(String(data.duration_days))

      // 下载并缓存图片
      const cachedImages = await Promise.all(
        data.image_urls.map(async (url) => {
          const downloadRes = await Taro.downloadFile({ url });
          const saved = await cacheFile(downloadRes.tempFilePath);
          return { url: saved };
        })
      );
      setFiles(cachedImages);
      setVideo('');
    };

    fetchAndCacheFiles();
  }, [noteId]);

  return (
    <View className='publish-page'>
      <View className='title'>
        <AtIcon value='edit' size='30' color='#000' /> 编辑游记
      </View>

      {/* 表单内容 */}
      <NoteForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        location={location}
        setLocation={setLocation}
        seasonIndex={seasonIndex}
        setSeasonIndex={setSeasonIndex}
        cost={cost}
        setCost={setCost}
        days={days}
        setDays={setDays}
      />

      {/* 图片和视频上传 */}
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
                <AtButton size='normal' type='secondary' onClick={() => setVideo('')}>删除视频</AtButton>
              </View>
            </View>
          ) : (
            <View className='upload-btn' onClick={handleChooseVideo}>请重新选择视频</View>
          )}
        </View>
      </View>

      {/* 保存按钮 */}
      <AtButton type='primary' className='submit-btn' disabled={isUploading} onClick={handleSubmit}>
        保存
      </AtButton>
    </View>
  )
}
