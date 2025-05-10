import { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'
import Waterfall from "../../components/Waterfall"

import logo from '../../assets/logo.png'
import {getMockNoteList, getNoteList} from "../../api/note";

interface NoteItem {
  id: number
  cover: string
  title: string
  avatar: string
  nickname: string
  views: number
}

const parseNoteData = (raw: any): NoteItem => ({
  id: raw.id,
  title: raw.title,
  cover: raw.image_urls?.[0] || '',
  avatar: raw.author?.avatar || '',
  nickname: raw.author?.nickname || '',
  views: raw.view_count || 0
})

export default function Index() {
  const PAGE_SIZE = 10

  // 每个 tab 独立维护自己的数据
  const [discoveryData, setDiscoveryData] = useState<NoteItem[]>([])
  const [localData, setLocalData] = useState<NoteItem[]>([])
  const [followData, setFollowData] = useState<NoteItem[]>([])

  const [discoveryPage, setDiscoveryPage] = useState(0)
  const [localPage, setLocalPage] = useState(0)
  const [followPage, setFollowPage] = useState(0)

  const [hasMoreDiscovery, setHasMoreDiscovery] = useState(true)
  const [hasMoreLocal, setHasMoreLocal] = useState(true)
  const [hasMoreFollow, setHasMoreFollow] = useState(true)

  const [loading, setLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState<'discovery' | 'local' | 'follow'>('discovery')

  // 你可以用下面的方式来切换不同 tab
  const handleTabChange = (tab: 'discovery' | 'local' | 'follow') => {
    if (tab === currentTab) return
    setCurrentTab(tab)
  }

  const loadMore = async () => {
    if (loading) return  // 如果正在加载，则不再发送请求

    setLoading(true)
    const offset = {
      discovery: discoveryPage,
      local: localPage,
      follow: followPage
    }[currentTab] * PAGE_SIZE

    try {
      let res
      const isMock = currentTab === 'discovery'

      if (isMock) {
        res = await getMockNoteList({ offset, limit: PAGE_SIZE })
      } else {
        res = await getNoteList({ offset, limit: PAGE_SIZE })
      }

      if (res.data.code === 0) {
        const rawList = res.data.data.list || []
        const newData = rawList.map(item => parseNoteData(item))

        if (currentTab === 'discovery') {
          setDiscoveryData(prev => [...prev, ...newData])
          setDiscoveryPage(prev => prev + 1)
          setHasMoreDiscovery(newData.length === PAGE_SIZE)
        } else if (currentTab === 'local') {
          setLocalData(prev => [...prev, ...newData])
          setLocalPage(prev => prev + 1)
          setHasMoreLocal(newData.length === PAGE_SIZE)
        } else if (currentTab === 'follow') {
          setFollowData(prev => [...prev, ...newData])
          setFollowPage(prev => prev + 1)
          setHasMoreFollow(newData.length === PAGE_SIZE)
        }
      }
    } catch (error) {
      console.error('加载更多数据失败：', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    // 每次切换 tab 时重置该 tab 的数据
    setLoading(false)
    if (currentTab === 'discovery') {
      setDiscoveryData([])
      setDiscoveryPage(0)
      setHasMoreDiscovery(true)
    } else if (currentTab === 'local') {
      setLocalData([])
      setLocalPage(0)
      setHasMoreLocal(true)
    } else if (currentTab === 'follow') {
      setFollowData([])
      setFollowPage(0)
      setHasMoreFollow(true)
    }
  }, [currentTab])  // 监听 currentTab 的变化

  useEffect(() => {
    // 如果页面数据为空时，触发首次加载
    if (
      (currentTab === 'discovery' && discoveryData.length === 0) ||
      (currentTab === 'local' && localData.length === 0) ||
      (currentTab === 'follow' && followData.length === 0)
    ) {
      loadMore()
    }
  }, [currentTab, discoveryData, localData, followData])  // 监听数据更新时触发 loadMore

  return (
    <View className='index-page'>
      <View className='navbar'>
        <Image src={logo} className='logo' />
        <View className="tabs-wrapper">
          <View
            className={`tab ${currentTab === 'discovery' ? 'active' : ''}`}
            onClick={() => handleTabChange('discovery')}
          >
            发现
          </View>
          <View
            className={`tab ${currentTab === 'local' ? 'active' : ''}`}
            onClick={() => handleTabChange('local')}
          >
            本地
          </View>
          <View
            className={`tab ${currentTab === 'follow' ? 'active' : ''}`}
            onClick={() => handleTabChange('follow')}
          >
            关注
          </View>
        </View>
        <View className="search-btn">
          <AtIcon value='search' size='24' color='#333' />
        </View>
      </View>

      {/* 主体内容 */}
      <Waterfall
        key={currentTab}
        data={
          currentTab === 'discovery' ? discoveryData :
            currentTab === 'local' ? localData :
              followData
        }
        hasMore={
          currentTab === 'discovery' ? hasMoreDiscovery :
            currentTab === 'local' ? hasMoreLocal :
              hasMoreFollow
        }
        loadMore={loadMore}
      />
    </View>
  )
}
