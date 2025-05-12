import {View, Text, Image, Button, ScrollView} from '@tarojs/components';
import {AtIcon, AtImagePicker, AtList, AtListItem} from 'taro-ui';
import './index.scss';
import Taro, { navigateTo, eventCenter} from '@tarojs/taro';
import { useAuth } from '../../hooks/useAuth'; // 导入useAuth hook
import avatarDefault from '../../assets/avatar-default.jpg';
import {useEffect, useState} from "react";
import {uploadAvatar} from "../../api/user";
import { getNotesByStatus } from '../../api/note';
import {NoteAPI} from "../../../types/note";



export default function Index() {

  const { user, isLoggedIn, reloadUserInfo } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [files, setFiles] = useState<{ url: string }[]>([]);
  const [notes, setNotes] = useState<NoteAPI.NoteItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('approved');

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          Taro.removeStorageSync('token');
          Taro.removeStorageSync('user');
          reloadUserInfo(); // 触发重新加载用户状态
          Taro.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  };
  const handleJournalClick = async (status: string) => {
    setSelectedStatus(status);

    try {
      const res = await getNotesByStatus(status);
      if (res.data.code === 0) {
        setNotes(res.data.data);
      } else {
        Taro.showToast({ title: '获取游记失败', icon: 'none' });
      }
    } catch (error) {
      console.error(error);
      Taro.showToast({ title: '请求错误', icon: 'none' });
    }
  };
  const handleUpload = async () => {
    if (files.length === 0) return;

    const tempFilePath = files[0].url;

    try {
      const avatarData = await uploadAvatar(tempFilePath);

      // ✅ 更新本地用户信息
      const userInfo = Taro.getStorageSync('user') || {};
      userInfo.avatar = avatarData.avatar;
      Taro.setStorageSync('user', userInfo);

      reloadUserInfo();
      setShowEdit(false);
      Taro.showToast({ title: '头像更新成功', icon: 'success' });
      console.log(Taro.getStorageSync('user'));
    } catch (e: any) {
      console.error(e);
      Taro.showToast({ title: e.message || '上传失败', icon: 'none' });
    }
  };

  useEffect(() => {
    const handleLoginSuccess = () => {
      reloadUserInfo(); // 重新加载用户信息
      handleJournalClick(selectedStatus);
    };
    eventCenter.on('loginSuccess', handleLoginSuccess);
    // 默认加载已发布的游记
    handleJournalClick('approved');
    return () => {
      eventCenter.off('loginSuccess', handleLoginSuccess);
    };
  }, []);

  return (
    <View className='me-page'>

      {showEdit && (
        <View className='edit-overlay'>
          <View className='edit-box'>
            <View className='edit-header'>
              <Text>修改个人信息</Text>
              <AtIcon value='close' size='20' onClick={() => setShowEdit(false)} />
            </View>
            <View className='edit-content'>
              <Text>选择头像：</Text>
              <AtImagePicker
                files={files}
                onChange={(newFiles) => setFiles(newFiles)}
                count={1}
                showAddBtn={files.length < 1}
              />
              <Button type='primary' onClick={handleUpload}>上传</Button>
            </View>
          </View>
        </View>

      )}

      {/* 顶部个人信息 */}
      <View className='user-info'>
        <View className='user-left'>
          <Image
            className='avatar'
            mode='aspectFill'
            src={user?.avatar ?  user.avatar : avatarDefault}
            onClick={() => {
              if (user?.avatar) {
                Taro.previewImage({
                  current: user.avatar, // 当前显示图片
                  urls: [user.avatar], // 图片列表
                });
              }
            }}
          />
          <Text className='nickname'>
            {isLoggedIn ? user?.nickname || '匿名用户' : '未登录，请先登录吧'}
          </Text>
        </View>
        <View
          className='user-right'
          onClick={() => {
            if (!isLoggedIn) {
              navigateTo({ url: '/pages/login/index' });
            } else {
              setShowEdit(true);
            }
          }}
        >
          <Text className='info-btn'>
            {isLoggedIn ? '修改个人信息' : '前往登录'}
          </Text>
          <AtIcon value='chevron-right' size='20' color='#999' />
        </View>
      </View>

      {/* 我的游记 区域 */}
      <View className='my-journals-wrapper'>
        <View className='journals-title'>我的游记</View>
        <View className='my-journals'>
          <View className='journal-item' onClick={() => handleJournalClick('approved')}>
            <AtIcon value='check-circle' size='30' color='#34C759' />
            <Text>已发布</Text>
          </View>
          <View className='journal-item' onClick={() => handleJournalClick('pending')}>
            <AtIcon value='clock' size='30' color='#FFCC00' />
            <Text>待审核</Text>
          </View>
          <View className='journal-item' onClick={() => handleJournalClick('rejected')}>
            <AtIcon value='close-circle' size='30' color='#FF3B30' />
            <Text>未通过</Text>
          </View>
        </View>
      </View>

      {/* 游记列表 区域 */}
      <ScrollView className='journal-lists' scrollY>
        {selectedStatus && (
          <View className='journal-list'>
            <Text className='journal-list-title'>
              {selectedStatus === 'approved' && '已发布游记'}
              {selectedStatus === 'pending' && '待审核游记'}
              {selectedStatus === 'rejected' && '未通过游记'}
            </Text>
            {notes.length > 0 ? (
              notes.map(note => (
                <View
                  className='note-card'
                  key={note.id}
                  onClick={() => navigateTo({ url: `/pages/detail/index?id=${note.id}` })}
                >
                  <Image className='note-cover' src={note.image_urls?.[0]} mode='aspectFill' />
                  <View className='note-info'>
                    <Text className='note-title'>{note.title}</Text>
                    <Text className='note-location'>{note.location}</Text>
                  </View>
                  <Text className='detail-btn'>
                    游记详情
                  </Text>
                  <AtIcon value='chevron-right' size='20' color='#999' />
                </View>
              ))
            ) : (
              <Text className='no-data'>暂无游记</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* 客服 & 设置 */}
      <AtList className='bottom-list'>
        <AtListItem title='联系客服' arrow='right' iconInfo={{ value: 'phone' }} />
        <AtListItem title='设置' arrow='right' iconInfo={{ value: 'settings' }} />
        <AtListItem title='退出登录' arrow='right' iconInfo={{ value: 'play'}} onClick={handleLogout}/>
      </AtList>
    </View>
  );
}
