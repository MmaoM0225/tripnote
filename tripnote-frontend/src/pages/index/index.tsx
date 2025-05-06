import { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtIcon } from 'taro-ui'
import './index.scss'
import Waterfall from "../../components/Waterfall"
import { useLoad } from "@tarojs/taro"
import logo from '../../assets/logo.png'


const tabList = [{ title: '发现' }, { title: '本地' }, { title: '关注' }]

const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${index}`,
    cover: `https://picsum.photos/300/${300 + (index % 3) * 100}?random=${index}`,
    title: `游记标题 ${index + 1}`,
    avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index % 50}.jpg`,
    nickname: `作者${index + 1}`,
    views: Math.floor(Math.random() * 5000),
  }))
}

export default function Index() {
  useLoad(() => {
    console.log('主頁加載了Page loaded.')
  })

  const allData = generateMockData(100)
  const PAGE_SIZE = 10

  const [dataList, setDataList] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)

  const loadMore = () => {
    if (loading || !hasMore) return
    setLoading(true)

    setTimeout(() => {
      const start = page * PAGE_SIZE
      const newData = allData.slice(start, start + PAGE_SIZE)

      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setDataList(prev => [...prev, ...newData])
        setPage(prev => prev + 1)
      }

      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    const initData = allData.slice(0, PAGE_SIZE)
    setDataList(initData)
    setPage(1)
  }, [])

  return (
    <View className='index-page'>
      <View className='navbar'>
        <Image src={logo} className='logo' />
        <View className='tabs-wrapper'>
          <AtTabs
            current={currentTab}
            tabList={tabList}
            onClick={(value) => setCurrentTab(value)}
            swipeable={false}
            className='tabs'
          >
          </AtTabs>
        </View>
          <View className="search-btn">
            <AtIcon value='search' size='24' color='#333' />
          </View>

      </View>

      {/* 主体内容 */}
      <Waterfall data={dataList} hasMore={hasMore} loadMore={loadMore} />
    </View>
  )
}
