import React, { useState, useEffect, useRef } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NoteCard from '../NoteCard'
import './index.scss'

interface NoteItem {
  id: string
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
}

const Waterfall: React.FC<WaterfallProps> = ({ data, hasMore, loadMore }) => {
  const [leftList, setLeftList] = useState<NoteItem[]>([])
  const [rightList, setRightList] = useState<NoteItem[]>([])

  const leftHeight = useRef(0)
  const rightHeight = useRef(0)

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

  const onScrollToLower = () => {
    if (hasMore) {
      loadMore()
    }
  }

  return (
    <ScrollView
      scrollY
      style={{ height: '100vh' }}
      lowerThreshold={150}
      onScrollToLower={onScrollToLower}
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
