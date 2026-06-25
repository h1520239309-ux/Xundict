/**
 * 生词本页面
 * 收藏的单词列表 + 卡片复习模式
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dictionaryData from '../assets/dictionary.json';
import { getFavorites, removeFavorite } from '../database/db';

const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  // 加载生词本
  const loadFavorites = async () => {
    const words = await getFavorites();
    setFavorites(words);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // 点击单词跳转到详情（跨 Tab 导航到 HomeTab 的 Detail 页）
  const handleWordPress = (word) => {
    navigation.navigate('HomeTab', {
      screen: 'Detail',
      params: { word },
    });
  };

  // 删除生词
  const handleDelete = async (word, e) => {
    e.stopPropagation();
    await removeFavorite(word);
    loadFavorites();
  };

  // 开始复习
  const startReview = () => {
    if (favorites.length > 0) {
      setCurrentIndex(0);
      setShowAnswer(false);
      setReviewMode(true);
    }
  };

  // 翻转卡片
  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: showAnswer ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setShowAnswer(!showAnswer);
  };

  // 下一个单词
  const nextCard = () => {
    if (currentIndex < favorites.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      flipAnim.setValue(0);
    } else {
      // 复习完成
      setReviewMode(false);
    }
  };

  // 获取当前单词数据
  const currentWord = favorites[currentIndex] 
    ? dictionaryData.find(item => item.word === favorites[currentIndex])
    : null;

  // 渲染列表项
  const renderItem = ({ item }) => {
    const wordData = dictionaryData.find(d => d.word === item);
    return (
      <TouchableOpacity
        style={styles.wordItem}
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
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // 复习模式
  if (reviewMode && currentWord) {
    return (
      <SafeAreaView style={styles.reviewContainer} edges={['top']}>
        <View style={styles.reviewHeader}>
          <TouchableOpacity onPress={() => setReviewMode(false)}>
            <Text style={styles.closeReview}>退出</Text>
          </TouchableOpacity>
          <Text style={styles.reviewProgress}>
            {currentIndex + 1} / {favorites.length}
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={flipCard}
            activeOpacity={0.9}
          >
            <Animated.View
              style={[
                styles.cardFace,
                {
                  opacity: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              <Text style={styles.cardWord}>{currentWord.word}</Text>
              <Text style={styles.cardHint}>点击查看释义</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.cardFace,
                styles.cardBack,
                {
                  opacity: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}
            >
              <Text style={styles.cardWordSmall}>{currentWord.word}</Text>
              <Text style={styles.cardPhonetic}>{currentWord.phonetic}</Text>
              {currentWord.meanings.map((m, i) => (
                <Text key={i} style={styles.cardMeaning}>
                  {m.pos} {m.def}
                </Text>
              ))}
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewActions}>
          <TouchableOpacity style={styles.nextButton} onPress={nextCard}>
            <Text style={styles.nextButtonText}>
              {currentIndex < favorites.length - 1 ? '下一个 →' : '完成 ✓'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 列表模式
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>生词本</Text>
        {favorites.length > 0 && (
          <TouchableOpacity style={styles.reviewButton} onPress={startReview}>
            <Text style={styles.reviewButtonText}>开始复习</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>还没有收藏的单词</Text>
          <Text style={styles.emptyHint}>查词时点击心形按钮收藏</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
  },
  reviewButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#334155',
  },
  meaningText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 3,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  // 复习模式样式
  reviewContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeReview: {
    fontSize: 15,
    color: '#64748b',
  },
  reviewProgress: {
    fontSize: 14,
    color: '#94a3b8',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    width: '100%',
    aspectRatio: 0.7,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  cardBack: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  cardWord: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  cardHint: {
    fontSize: 14,
    color: '#94a3b8',
  },
  cardWordSmall: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardPhonetic: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 20,
  },
  cardMeaning: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 10,
  },
  reviewActions: {
    padding: 30,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoriteScreen;
