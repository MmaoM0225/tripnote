import { View, Text, Input, Textarea } from '@tarojs/components'
import './index.scss'

const seasonOptions = ['春季', '夏季', '秋季', '冬季']

export default function Index(props) {
  const {
    title, setTitle,
    content, setContent,
    location, setLocation,
    seasonIndex, setSeasonIndex,
    cost, setCost,
    days, setDays
  } = props

  return (
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
)
}
