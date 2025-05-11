import { useState } from 'react'
import { View, Input, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'
import Taro from '@tarojs/taro'
import Waterfall from '../../components/Waterfall'
import {searchNotes} from '../../api/note'

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

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [resultList, setResultList] = useState<NoteItem[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const hotKeywords = [
    '来上海一定要沿着苏州河走一遭（沿途风景分享）',
    '在丽江古城邂逅一场浪漫的日落',
    '厦门鼓浪屿两日游完整攻略',
    '西安城墙夜骑体验，历史与现代的交融',
    '成都三天吃喝游路线推荐（含火锅地图）',
    '杭州西湖不止雷峰塔，这几处宝藏地点别错过',
    '青岛啤酒节实录：边喝边玩还拍大片',
    '大理洱海边最美骑行路线推荐',
    '解锁重庆8D魔幻立体城市玩法',
    '广州老城区美食地图：一条街吃遍早午晚'
  ]
  const history = ['重庆', '黄山', '成都']

  const PAGE_SIZE = 20

  const loadMore = async () => {
    if (loading || !hasMore || !keyword) return

    setLoading(true)
    try {
      const res = await searchNotes({
        keyword,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      })

      if (res.data.code === 0) {
        const list = res.data.data.list || []
        const newData = list.map(parseNoteData)
        setResultList(prev => [...prev, ...newData])
        setPage(prev => prev + 1)
        setHasMore(newData.length === PAGE_SIZE)
      }
    } catch (err) {
      console.error('搜索失败:', err)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    if (!keyword.trim()) {
      Taro.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }
    setShowResult(true)
    setPage(0)
    setHasMore(true)
    setResultList([])
    loadMore()
  }

  return (
    <View className="search-page">
      <View className="search-bar">
        <Input
          className="search-input"
          placeholder="搜索目的地/关键词"
          value={keyword}
          onInput={e => setKeyword(e.detail.value)}
          confirmType="search"
          onConfirm={handleSearch}
        />
        <View className="search-icon" onClick={handleSearch}>
          <AtIcon value="search" size="20" color="#000" />
        </View>
      </View>

      {!showResult ? (
        <>
          <View className="section">
            <Text className="section-title">热门搜索</Text>
            <View className="hot-list">
              {hotKeywords.map((item, index) => (
                <View
                  key={index}
                  className="hot-item"
                  onClick={() => {
                    setKeyword(item)
                    setShowResult(true)
                    setPage(0)
                    setHasMore(true)
                    setResultList([])
                    loadMore()
                  }}
                >
                  <Text className="hot-icon">🔥</Text>
                  <Text className="hot-title">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="section">
            <Text className="section-title">搜索历史</Text>
            <View className="history-tags">
              {history.map((item, index) => (
                <Text
                  key={index}
                  className="tag"
                  onClick={() => {
                    setKeyword(item)
                    setShowResult(true)
                    setPage(0)
                    setHasMore(true)
                    setResultList([])
                    loadMore()
                  }}
                >
                  {item}
                </Text>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View className="search-result">
          {resultList.length > 0 ? (
            <Waterfall
              data={resultList}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          ) : (
            <Text>暂无搜索结果</Text>
          )}
        </View>
      )}
    </View>
  )
}
