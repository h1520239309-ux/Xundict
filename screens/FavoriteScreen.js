/**
 * 生词本页面
 * iOS Large Title + 卡片列表 + 空状态
 * UI: 橄榄绿品牌色，圆角卡片样式
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/Colors';
import FONTS from '../constants/Fonts';
import dictionaryData from '../assets/dictionary.json';
import { getFavorites, removeFavorite } from '../database/db';

const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    const words = await getFavorites();
    setFavorites(words);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleWordPress = (word) => {
    navigation.navigate('HomeTab', {
      screen: 'Detail',
      params: { word },
    });
  };

  const handleDelete = async (word, e) => {
    e.stopPropagation();
    await removeFavorite(word);
    loadFavorites();
  };

  const renderItem = ({ item }) => {
    const wordData = dictionaryData.find(d => d.word === item);
    return (
      <TouchableOpacity
        style={styles.wordCard}
        onPress={() => handleWordPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.wordInfo}>
          <Text style={styles.wordText}>{item}</Text>
          <Text style={styles.meaningText} numberOfLines={1}>
            {wordData?.meanings[0]?.def || ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => handleDelete(item, e)}
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // 列表模式
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* iOS Large Title */}
      <View style={styles.header}>
        <Text style={styles.title}>生词本</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../assets/empty-state-books-nobg.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>还没有收藏的单词</Text>
          <Text style={styles.emptyHint}>查询时点击心形按钮收藏</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: FONTS.primary,
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  wordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: FONTS.englishBold,
    color: COLORS.textPrimary,
  },
  meaningText: {
    fontSize: 18,
    fontFamily: FONTS.english,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
    fontFamily: FONTS.primary,
    color: '#C7C7CC',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: FONTS.primary,
    color: COLORS.textTertiary,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    color: COLORS.textQuaternary,
  },
});

export default FavoriteScreen;
