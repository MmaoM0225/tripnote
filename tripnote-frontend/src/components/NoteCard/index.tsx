import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface NoteCardProps {
  cover: string
  title: string
  avatar: string
  nickname: string
  views: number
}

// 使用 React.memo 来优化性能
const NoteCard: React.FC<NoteCardProps> = React.memo(({ cover, title, avatar, nickname, views }) => {
  return (
    <View className="waterfall-item">
      <Image src={cover} className="item-cover" lazyLoad={true} mode="widthFix" />
      <View className="item-title">
        <Text>{title}</Text>
      </View>
      <View className="item-bottom">
        <Image src={avatar} className="item-avatar" />
        <Text className="item-nickname">{nickname}</Text>
        <Text className="item-views">{views} 浏览</Text>
      </View>
    </View>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数，只有当 props 中的内容发生变化时才重新渲染
  return (
    prevProps.cover === nextProps.cover &&
    prevProps.title === nextProps.title &&
    prevProps.avatar === nextProps.avatar &&
    prevProps.nickname === nextProps.nickname &&
    prevProps.views === nextProps.views
  )
})

export default NoteCard
