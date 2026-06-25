/**
 * 单词详情页
 * 单词 + 音标 + 发音 + 释义 + 收藏按钮
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import dictionaryData from '../assets/dictionary.json';
import { isFavorite, addFavorite, removeFavorite } from '../database/db';

const DetailScreen = ({ route }) => {
  const { word } = route.params;
  const navigation = useNavigation();
  const [wordData, setWordData] = useState(null);
  const [favorited, setFavorited] = useState(false);

  // 加载单词数据和收藏状态
  useEffect(() => {
    // 查找单词
    const data = dictionaryData.find(item => item.word === word);
    setWordData(data);

    // 检查收藏状态
    checkFavoriteStatus();
  }, [word]);

  const checkFavoriteStatus = async () => {
    const status = await isFavorite(word);
    setFavorited(status);
  };

  // 发音
  const handleSpeak = () => {
    Speech.speak(word, {
      language: 'en',
      rate: 0.8,
    });
  };

  // 切换收藏状态
  const toggleFavorite = async () => {
    if (favorited) {
      await removeFavorite(word);
      setFavorited(false);
    } else {
      await addFavorite(word);
      setFavorited(true);
    }
  };

  if (!wordData) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>未找到该单词</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 顶部单词区 */}
      <View style={styles.wordHeader}>
        <Text style={styles.wordText}>{wordData.word}</Text>
        <View style={styles.phoneticRow}>
          <Text style={styles.phoneticText}>/{wordData.phonetic || ''}/</Text>
          <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
            <Text style={styles.speakIcon}>🔊</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Text style={[styles.favoriteIcon, favorited && styles.favoritedIcon]}>
              {favorited ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 释义区 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>释义</Text>
        {wordData.meanings.map((meaning, index) => (
          <View key={index} style={styles.meaningItem}>
            {meaning.pos && (
              <Text style={styles.partOfSpeech}>{meaning.pos}</Text>
            )}
            <Text style={styles.definition}>{meaning.def}</Text>
          </View>
        ))}
      </View>

      {/* 底部留白 */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#94a3b8',
    fontSize: 16,
  },
  wordHeader: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  wordText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1e293b',
    letterSpacing: 1,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  phoneticText: {
    fontSize: 16,
    color: '#64748b',
  },
  speakButton: {
    marginLeft: 15,
    padding: 5,
  },
  speakIcon: {
    fontSize: 22,
  },
  favoriteButton: {
    marginLeft: 10,
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 22,
  },
  favoritedIcon: {
    opacity: 1,
  },
  section: {
    paddingHorizontal: 25,
    paddingTop: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 15,
    letterSpacing: 1,
  },
  meaningItem: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  partOfSpeech: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginRight: 10,
    minWidth: 40,
  },
  definition: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
    lineHeight: 22,
  },
});

export default DetailScreen;
