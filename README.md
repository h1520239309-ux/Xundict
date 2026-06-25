# 寻 - 极简查词 App

下载地址：https://github.com/h1520239309-ux/Xundict/releases

一款简洁高效的离线英语查词应用，专为快速查词设计。

---

## 功能特点

| 功能 | 说明 |
|------|------|
| 离线查词 | 5 万高频词本地词库，无需网络 |
| 中文搜索 | 输入中文释义自动匹配英文单词 |
| 单词发音 | 系统 TTS 语音发音 |
| 生词本 | 收藏单词，轻松管理 |
| 搜索历史 | 自动记录查询记录，一键清空 |
| 一键清除 | 输入框快速清空按钮 |

---

## 技术栈

| 技术 | 说明 |
|------|------|
| React Native | 跨平台移动开发框架 |
| Expo SDK | 开发与构建工具 |
| React Navigation | 页面导航 |
| Expo SQLite | 本地数据存储 |
| Expo Speech | 语音发音 |
| Cause 字体 | 英文显示（OFL 1.1 开源） |
| 乐米小奶泡体 | 中文显示（Q萌圆润风格） |

---

## 项目结构

```
Xundict-master/
├── assets/
│   ├── fonts/                # 字体文件
│   ├── dictionary.json       # 5 万词离线词库
│   ├── icon.png              # App 图标
│   ├── splash.png            # 启动页图片
│   └── logo-xun-nobg.png     # 品牌Logo
├── components/
│   ├── CustomTabBar.js       # 自定义底部导航栏
│   └── RadialGradientBackground.js  # 径向渐变背景
├── constants/
│   ├── Colors.js             # 品牌配色（粉绿撞色）
│   └── Fonts.js              # 字体配置
├── database/
│   └── db.js                 # SQLite 数据库封装
├── screens/
│   ├── HomeScreen.js         # 首页 - 搜索 & 历史
│   ├── DetailScreen.js       # 详情页 - 单词释义
│   └── FavoriteScreen.js     # 生词本
├── App.js                    # 应用入口 + 导航配置
├── app.json                  # Expo 应用配置
├── eas.json                  # EAS 构建配置
└── package.json              # 依赖管理
```

---

## 使用说明

### 查词方式

1. 英文前缀搜索：输入 `hel` -> 匹配 `hello`, `help`, `hell` 等
2. 中文释义搜索：输入 `好` -> 匹配所有释义含"好"的单词

### 生词本

- 点击详情页的收藏按钮添加
- 在「生词本」标签页查看所有收藏
- 点击单词可快速跳转查看详情
- 左滑删除或点击 x 按钮移除

### 历史记录

- 自动保存最近查询的单词
- 点击「清空」按钮可清除全部历史

---

## 许可证

- 代码：MIT License
- 词库：ECDICT（开源项目）
- 英文字体 Cause：OFL 1.1（开源免费可商用）
