# 寻 - 极简查词 App
下载地址：https://github.com/h1520239309-ux/Xundict/releases
一款简洁高效的离线英语查词应用，专为快速查词设计。

---

## ✨ 功能特点

| 功能 | 说明 |
|------|------|
| 🔍 **离线查词** | 5 万高频词本地词库，无需网络 |
| 🇨🇳 **中文搜索** | 输入中文释义自动匹配英文单词 |
| 📢 **单词发音** | 系统 TTS 语音发音 |
| 📚 **生词本** | 收藏单词，卡片式复习 |
| 📖 **搜索历史** | 自动记录查询记录 |
| 🎨 **简洁界面** | 蓝色主题，清爽美观 |

---

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React Native** | 0.76.x | 跨平台移动开发框架 |
| **Expo SDK** | 56 | 开发与构建工具 |
| **React Navigation** | 7.x | 页面导航 |
| **Expo SQLite** | - | 本地数据存储 |
| **Expo Speech** | - | 语音发音 |
| **词库** | 5 万词 | 基于 ECDICT 开源词典 |

---

## 📁 项目结构

```
XunDict_SDK56/
├── assets/
│   ├── dictionary.json      # 5 万词离线词库（9.68 MB）
│   ├── icon.png             # App 图标
│   ├── adaptive-icon.png    # Android 自适应图标
│   └── splash.png           # 启动页图片
├── database/
│   └── db.js                # SQLite 数据库封装（历史/收藏）
├── screens/
│   ├── HomeScreen.js        # 首页 - 搜索 & 推荐 & 历史
│   ├── DetailScreen.js      # 详情页 - 单词释义
│   └── FavoriteScreen.js    # 生词本 - 复习管理
├── App.js                   # 应用入口 + 导航配置
├── app.json                 # Expo 应用配置
├── eas.json                 # EAS 构建配置
├── package.json             # 依赖管理
└── metro.config.js          # Metro 打包配置
```

## 📖 使用说明

### 查词方式

1. **英文前缀搜索**：输入 `hel` → 匹配 `hello`, `help`, `hell` 等
2. **中文释义搜索**：输入 `好` → 匹配所有释义含"好"的单词

### 生词本

- 点击详情页的 **⭐ 收藏** 按钮添加
- 在「生词本」标签页查看所有收藏
- 点击单词可快速跳转查看详情

### 历史记录

- 自动保存最近查询的单词
- 点击「清空」按钮可清除全部历史

---
## 📚 词库说明

### 数据来源

基于 **ECDICT** 开源英汉词典：
- 原始数据：76 万词条
- 筛选标准：按词频、BNC、牛津、柯林斯词典综合评分取前 5 万
### 数据格式

```json
{
  "word": "hello",
  "phonetic": "hə'lo",
  "meanings": [
    { "def": "int. 喂；你好" },
    { "def": "n. 表示问候；惊奇声" }
  ]
}
```

### 更新词库

如需更新/扩展词库：
1. 参考 `_source_backup/convert_dict_v2.py`
2. 生成新的 `dictionary.json`
3. 替换 `assets/` 目录下的文件
4. 重新构建 APK

---

## ⚙️ 配置说明

### app.json 关键配置

```json
{
  "name": "寻 - 极简查词",       // 应用显示名称
  "slug": "xundict",              // Expo 项目标识
  "version": "1.0.0",             // 版本号
  "android": {
    "package": "com.xun.dict"     // Android 包名
  }
}
```

### 数据库存储

- **历史记录**：`search_history` 表
- **生词收藏**：`favorites` 表
- Web 环境自动降级到 `localStorage`
---
## ❓ 常见问题
### Q: 想增加更多单词？

A: 修改 `_source_backup/convert_dict_v2.py` 的筛选条件，重新生成词库。

### Q: 如何更换主题色？

A: 修改各页面组件中的 `blue` / `#2563eb` 相关颜色代码。
---
## 📝 更新日志
### v1.0.0

- ✅ 基础查词功能（5 万词）
- ✅ 中文释义搜索
- ✅ 单词发音
- ✅ 生词本收藏
- ✅ 搜索历史
- ✅ 底部安全区域适配

---

## 📄 许可证

- **代码**：MIT License
- **词库**：ECDICT（开源项目）

---

**Made with ❤️ by Solo Assistant**
