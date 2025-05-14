import {useState, useEffect, useRef, useCallback} from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NoteCard from '../NoteCard'
import './index.scss'

interface NoteItem {
  id: number
  cover: string
  title: string
  avatar: string
  nickname: string
  views: number
}

interface WaterfallProps {
  data: NoteItem[]
  hasMore: boolean
  loadMore: () => void
  loading: boolean
  resetKey: string
}

const Waterfall = ({ data, hasMore, loadMore, loading, resetKey }: WaterfallProps)  => {
  const [leftList, setLeftList] = useState<NoteItem[]>([])
  const [rightList, setRightList] = useState<NoteItem[]>([])

  const leftHeight = useRef(0)
  const rightHeight = useRef(0)
  const lastCallTime = useRef(0)
  const throttleDelay = 1500  // 设置节流时间，例如 1 秒

  const throttledLoadMore = useCallback(() => {
    const now = Date.now()

    // 未到达间隔，不执行
    if (now - lastCallTime.current < throttleDelay) return

    if (!loading && hasMore) {
      lastCallTime.current = now
      loadMore()
    }
  }, [loading, hasMore, loadMore])
  const onScrollToLower = () => {
    throttledLoadMore()
  }

  useEffect(() => {
    distributeItems(data.slice(leftList.length + rightList.length))
  }, [data])

  const distributeItems = (newItems: NoteItem[]) => {
    newItems.forEach(item => {
      Taro.getImageInfo({
        src: item.cover,
        success: (res) => {
          const ratio = res.height / res.width
          const itemHeight = 345 * ratio + 80 // 估算总高度：图片 + 文本区域
          if (leftHeight.current <= rightHeight.current) {
            leftList.push(item)
            leftHeight.current += itemHeight
            setLeftList([...leftList])
          } else {
            rightList.push(item)
            rightHeight.current += itemHeight
            setRightList([...rightList])
          }
        }
      })
    })
  }

  useEffect(() => {
    setLeftList([])
    setRightList([])
    leftHeight.current = 0
    rightHeight.current = 0
  }, [resetKey])

  return (
    <ScrollView
      scrollY
      style={{ height: 'calc(100vh - 50px)' }}
      lowerThreshold={600}
      onScrollToLower={onScrollToLower}
      enhanced
      bounces={false}
      showScrollbar={false}
    >
      <View className="waterfall-container">
        <View className="column left-column">
          {leftList.map(item => (
            <NoteCard key={item.id} {...item} />
          ))}
        </View>
        <View className="column right-column">
          {rightList.map(item => (
            <NoteCard key={item.id} {...item} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default Waterfall
