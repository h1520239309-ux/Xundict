/**
 * 搜索首页
 * 顶部搜索框 + 搜索结果列表 + 底部历史记录
 * 支持英文前缀搜索 + 中文释义搜索
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dictionaryData from '../assets/dictionary.json';
import { getHistory, addHistory, clearHistory } from '../database/db';

// 推荐词汇（首次打开时展示，点击即可查看）
const RECOMMENDED_WORDS = [
  'hello', 'good', 'time', 'work', 'think',
  'people', 'year', 'first', 'day', 'look',
  'come', 'make', 'know', 'take', 'give',
  'want', 'love', 'life', 'world', 'home'
];

// 判断输入是否包含中文字符
const containsChinese = (text) => /[\u4e00-\u9fa5]/.test(text);

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchMode, setSearchMode] = useState('english'); // 'english' | 'chinese'
  const inputRef = useRef(null);

  // 加载历史记录
  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
    // 页面加载后自动聚焦搜索框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  // 搜索
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setSearchResults([]);
      setSearchMode('english');
      return;
    }

    const isChinese = containsChinese(text);
    setSearchMode(isChinese ? 'chinese' : 'english');

    if (isChinese) {
      // 中文搜索：匹配释义中包含该中文的单词
      const results = dictionaryData.filter(item => {
        // 检查所有释义的定义中是否包含搜索的中文
        return item.meanings.some(m => m.def && m.def.includes(text.trim()));
      }).slice(0, 30);
      setSearchResults(results);
    } else {
      // 英文前缀匹配搜索
      const results = dictionaryData.filter(item =>
        item.word.toLowerCase().startsWith(text.toLowerCase())
      ).slice(0, 30);
      setSearchResults(results);
    }
  };

  // 点击搜索结果
  const handleWordPress = async (word) => {
    Keyboard.dismiss();
    // 添加到历史记录
    await addHistory(word);
    // 刷新历史记录列表
    loadHistory();
    // 跳转到详情页
    navigation.navigate('Detail', { word });
  };

  // 渲染搜索结果项
  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleWordPress(item.word)}
      activeOpacity={0.7}
    >
      <Text style={styles.resultWord}>{item.word}</Text>
      <Text style={styles.resultPhonetic}>{item.phonetic}</Text>
      <Text style={styles.resultMeaning} numberOfLines={1}>
        {item.meanings[0]?.def}
      </Text>
    </TouchableOpacity>
  );

  // 渲染历史记录项
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleWordPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.historyWord}>{item}</Text>
    </TouchableOpacity>
  );

  // 清空历史
  const handleClearHistory = async () => {
    await clearHistory();
    loadHistory();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>寻</Text>
        <Text style={styles.subtitle}>极简查词</Text>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="输入单词或中文释义..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleSearch('')}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 搜索模式提示 */}
      {searchText.length > 0 && (
        <View style={styles.modeHint}>
          <Text style={styles.modeHintText}>
            {searchMode === 'chinese' ? '🔍 中文释义搜索' : '🔍 英文前缀搜索'}
          </Text>
        </View>
      )}

      {/* 搜索结果 / 历史记录 / 推荐词汇 */}
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.word}
            renderItem={renderResultItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      ) : searchText.length > 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noResultText}>未找到 "{searchText}"</Text>
          <Text style={styles.emptySubText}>
            {searchMode === 'chinese'
              ? '试试输入其他中文释义'
              : '试试输入其他单词'}
          </Text>
        </View>
      ) : history.length > 0 ? (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>搜索历史</Text>
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearHistoryText}>清空</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            keyExtractor={(item) => item}
            renderItem={renderHistoryItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      ) : (
        <View style={styles.recommendContainer}>
          <Text style={styles.recommendTitle}>✨ 点击任意单词开始</Text>
          <View style={styles.recommendTags}>
            {RECOMMENDED_WORDS.map((word) => (
              <TouchableOpacity
                key={word}
                style={styles.recommendTag}
                onPress={() => handleWordPress(word)}
                activeOpacity={0.7}
              >
                <Text style={styles.recommendTagText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#2563eb',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    letterSpacing: 2,
  },
  searchContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#f5f7fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 13,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 16,
    color: '#999',
  },
  modeHint: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  modeHintText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultWord: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  resultPhonetic: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  resultMeaning: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 13,
    color: '#999',
  },
  clearHistoryText: {
    fontSize: 13,
    color: '#2563eb',
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  historyWord: {
    fontSize: 15,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  recommendContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  recommendTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
    textAlign: 'center',
  },
  recommendTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  recommendTag: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#f0f5ff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  recommendTagText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '500',
  },
});

export default HomeScreen;
