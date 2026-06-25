/**
 * 搜索首页
 * 居中 Logo + 胶囊搜索栏 + 搜索历史
 * 支持英文前缀搜索 + 中文释义搜索
 * UI: 橄榄绿品牌色，iOS 原生风格
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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/Colors';
import FONTS from '../constants/Fonts';
import dictionaryData from '../assets/dictionary.json';
import { getHistory, addHistory, clearHistory } from '../database/db';

const containsChinese = (text) => /[\u4e00-\u9fa5]/.test(text);

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchMode, setSearchMode] = useState('english');
  const inputRef = useRef(null);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

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
      const results = dictionaryData.filter(item => {
        return item.meanings.some(m => m.def && m.def.includes(text.trim()));
      }).slice(0, 30);
      setSearchResults(results);
    } else {
      const results = dictionaryData.filter(item =>
        item.word.toLowerCase().startsWith(text.toLowerCase())
      ).slice(0, 30);
      setSearchResults(results);
    }
  };

  const handleWordPress = async (word) => {
    Keyboard.dismiss();
    await addHistory(word);
    loadHistory();
    navigation.navigate('Detail', { word });
  };

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

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleWordPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.historyWord}>{item}</Text>
    </TouchableOpacity>
  );

  const handleClearHistory = async () => {
    await clearHistory();
    loadHistory();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Logo 区域 */}
      <View style={styles.logoArea}>
        <Image
          source={require('../assets/logo-xun-nobg.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          {/* 搜索图标 */}
          <Ionicons name="search-outline" size={20} color={COLORS.textTertiary} style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="输入要查询的词语"
            placeholderTextColor={COLORS.textTertiary}
            value={searchText}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {/* 清除按钮 */}
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                handleSearch('');
                inputRef.current?.focus();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 搜索历史标题 */}
      {!searchText && history.length > 0 && (
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>搜索历史</Text>
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.clearHistoryText}>清空</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 搜索模式提示 */}
      {searchText.length > 0 && (
        <View style={styles.modeHint}>
          <Text style={styles.modeHintText}>
            {searchMode === 'chinese' ? '中文释义搜索' : '英文前缀搜索'}
          </Text>
        </View>
      )}

      {/* 内容区域 */}
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
          <FlatList
            data={history}
            keyExtractor={(item) => item}
            renderItem={renderHistoryItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Logo 区域
  logoArea: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  // 搜索栏
  searchRow: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLORS.searchBg,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: FONTS.primary,
    color: COLORS.textPrimary,
    padding: 0,
    height: 50,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  // 搜索历史标题
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: FONTS.primary,
    color: COLORS.textSecondary,
  },
  clearHistoryText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    color: COLORS.primary,
  },
  // 搜索模式提示
  modeHint: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  modeHintText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: COLORS.textTertiary,
  },
  // 搜索结果
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultItem: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  resultWord: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FONTS.englishSemiBold,
    color: COLORS.textPrimary,
  },
  resultPhonetic: {
    fontSize: 14,
    fontFamily: FONTS.english,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  resultMeaning: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  // 历史记录
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  historyWord: {
    fontSize: 17,
    fontFamily: FONTS.english,
    color: COLORS.textSecondary,
  },
  // 空状态
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    color: COLORS.textTertiary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 15,
    fontFamily: FONTS.primary,
    color: COLORS.textQuaternary,
  },
});

export default HomeScreen;
