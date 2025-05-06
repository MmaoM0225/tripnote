export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/publish/index',
    'pages/my/index',
    'pages/detail/index',
    'pages/login/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1296db',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabBar/home.png',
        selectedIconPath: 'assets/tabBar/home-active.png'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布',
        iconPath: 'assets/tabBar/publish.png',
        selectedIconPath: 'assets/tabBar/publish-active.png'
      },
      {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: 'assets/tabBar/my.png',
        selectedIconPath: 'assets/tabBar/my-active.png'
      }
    ]
  }
})

